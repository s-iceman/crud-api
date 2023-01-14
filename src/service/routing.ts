import * as url from 'url';
import { ServerResponse, IncomingMessage} from 'node:http';
import { StatusCodes, ENDPOINT, Messages } from './constants';
import { IUser, IDatabase } from '../model/interfaces';
import { IRouter } from './interfaces';
import { validateEndpoint, validateUserId } from './validators';

type HandlerCollection = object;
type ResultType = Array<IUser> | IUser | string;
type Command = (userId: string) => IUser | void | never;


export class UsersApiRouter implements IRouter {
  private database: IDatabase | undefined;
  private handlers: HandlerCollection;

  constructor() {
    this.handlers = {
      'GET': this.processGetRequest.bind(this),
      'POST': this.processPostRequest.bind(this),
      'DELETE': this.processDeleteRequest.bind(this),
    };
  }

  connect(database: IDatabase) {
    this.database = database;
  }

  route(req: IncomingMessage, res: ServerResponse): void {
    if (!this.handlers) {
      return;
    }

    const reqUrl = url.parse(req.url).pathname;
    if (!validateEndpoint(reqUrl)) {
      this.sendResult(res, StatusCodes.NotFound, Messages.AddressNotFound);
      return;
    }

    const handler = this.handlers[req.method];
    if (handler) {
      handler(reqUrl, res);
    }
  };

  private processGetRequest(url: string, res: ServerResponse): void {
    if (url == ENDPOINT) {
      const users = this.database.getUsers();
      this.sendResult(res, StatusCodes.OK, users);
    } else {
      this.getUser(url, res);
    }
  }

  private processPostRequest(url: string, res: ServerResponse): void {
    return;
  }

  private processDeleteRequest(url: string, res: ServerResponse): void {
    this.processUser(url, res, this.database.deleteUser.bind(this.database));
  }

  private getUser(url: string, res: ServerResponse): void {
    this.processUser(url, res, this.database.getUser.bind(this.database));
  }

  private processUser(url: string, res: ServerResponse, op: Command): void {
    const userId = this.getUserId(url);
    if (!validateUserId(userId)) {
      this.sendResult(res, StatusCodes.BadRequest, Messages.InvalidUserId);
      return;
    }

    try {
      const result = op(userId);
      console.log(`!!!! ${result}`);
      if (result) {
        this.sendResult(res, StatusCodes.OK, result);
      } else {
        this.sendResult(res, StatusCodes.NoContent);
      }
    } catch (error) {
      this.sendResult(res, StatusCodes.NotFound, Messages.UserNotFound);
    }
  }

  private sendResult(response: ServerResponse, code: number, result?: ResultType): void {
    response.setHeader('Content-Type', 'application/json');
    response.writeHead(code);
    if (result !== undefined) {
      response.end(JSON.stringify(result, null, '\n'));
    }
  }

  private getUserId(url: string): string {
    return url.slice(ENDPOINT.length + 1);
  }
}
