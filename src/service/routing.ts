import * as url from 'url';
import { ServerResponse, IncomingMessage} from 'node:http';
import { StatusCodes, ENDPOINT, Messages } from './constants';
import { IUser, IDatabase } from '../model/interfaces';
import { IRouter } from './interfaces';
import { validateEndpoint, validateUserFields, validateUserId } from './validators';

type Handler = (url: string, res: ServerResponse, req?: IncomingMessage) => Promise<void>;
type HandlerCollection = Record<string, Handler>;
type ResultType = Array<IUser> | IUser | string;
type Command<T, U> = (param: T) => U | never;
type CommandOptions = {
  userId?: string,
  res?: ServerResponse,
  req?: IncomingMessage,
  withBody?: boolean,
  successCode?: number,
  func?: Command<string | IUser, IUser | void>,
};
type ResultOptions = {
  res: ServerResponse,
  code: number,
  result?: ResultType,
};


export class UsersApiRouter implements IRouter {
  private database: IDatabase | undefined;
  private handlers: HandlerCollection;

  constructor() {
    this.handlers = {
      'GET': <Handler>this.processGetRequest.bind(this),
      'POST': <Handler>this.processPostRequest.bind(this),
      'PUT': <Handler>this.processPutRequest.bind(this),
      'DELETE': <Handler>this.processDeleteRequest.bind(this),
    };
  }

  connect(database: IDatabase) {
    this.database = database;
  }

  async route(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      if (!this.handlers) {
        return;
      }
  
      const reqUrl = url.parse(req.url).pathname;
      if (!validateEndpoint(reqUrl)) {
        this.sendResult({
          res,
          code: StatusCodes.NotFound,
          result: Messages.AddressNotFound}
        );
        return;
      }

      const handler = this.handlers[req.method];
      if (handler) {
        await handler(reqUrl, res, req);
      }
    } catch (error) {
      this.sendResult({
        res,
        code: StatusCodes.InternalServerError,
        result: Messages.ServerError,
      });
    }
  }

  private async processGetRequest(url: string, res: ServerResponse): Promise<void> {
    if (url == ENDPOINT) {
      const users = this.database.getUsers();
      this.sendResult({res, code: StatusCodes.OK, result: users});
    } else {
      await this.getUser(url, res);
    }
  }

  private async processPostRequest(url: string, res: ServerResponse, req: IncomingMessage): Promise<void> {
    await this.process({
      res, req,
      withBody: true,
      successCode: StatusCodes.Created,
      func: <Command<IUser, IUser>>this.database.createUser.bind(this.database)
    });
  }

  private async processPutRequest(url: string, res: ServerResponse, req: IncomingMessage): Promise<void> {
    const userId = this.getUserId(url, res);
    if (userId) {
      await this.process(
        {
          userId, res, req,
          successCode: StatusCodes.OK,
          func: <Command<IUser, IUser>>this.database.updateUser.bind(this.database),
          withBody: true
        }
      );
    }
  }

  private async processDeleteRequest(url: string, res: ServerResponse): Promise<void> {
    const userId = this.getUserId(url, res);
    if (userId) {
      await this.process(
        {
          userId, res,
          successCode: StatusCodes.NoContent,
          func: <Command<IUser, void>>this.database.deleteUser.bind(this.database)}
      );
    }
  }

  private async getUser(url: string, res: ServerResponse): Promise<void> {
    const userId = this.getUserId(url, res);
    if (userId) {
      await this.process(
        {
          userId, res,
          successCode: StatusCodes.OK,
          func: <Command<IUser, IUser>>this.database.getUser.bind(this.database)
        }
      );
    }
  }

  private async process(options: CommandOptions): Promise<void> {
    const {userId, res, req, func, withBody, successCode} = options;
    let body = undefined;
    if (withBody) {
      body = await UsersApiRouter.getBody(req).catch(() => {
        this.sendResult({res, code: StatusCodes.BadRequest, result: Messages.InvalidJsonFormat});
        return;
      });

      if (!validateUserFields(body)) {
        this.sendResult({res, code: StatusCodes.BadRequest, result: Messages.InvalidParams});
        return;
      }
    }

    const param = this.packUserParam(userId, body);
    try {
      const result = func(param);
      const options = result ? {res, result, code: successCode} : {res, code: successCode};
      this.sendResult(options);
    } catch (error) {
      this.sendResult({res, code: StatusCodes.NotFound, result: Messages.UserNotFound});
    }
  }

  private packUserParam(userId?: string, userBody?: IUser): IUser {
    if (userId && userBody) {
      return {id: userId, ...userBody};
    }
    return (userBody) ? userBody : {id: userId};
  }

  private getUserId(url: string, res: ServerResponse): string | undefined {
    const userId = url.slice(ENDPOINT.length + 1);
    if (!validateUserId(userId)) {
      this.sendResult({res, code: StatusCodes.BadRequest, result: Messages.InvalidUserId});
      return undefined;
    }
    return userId;
  }

  private sendResult(options: ResultOptions): void {
    const {result, res, code} = options;
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(code);
    if (result !== undefined) {
      res.end(JSON.stringify(result, null, '\n'));
    } else {
      res.end();
    }
  }

  private static async getBody(req: IncomingMessage) {
    return new Promise((resolve, reject) => {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject();
        }
      });
    });
  }
}
