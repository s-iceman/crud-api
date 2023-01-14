import * as url from 'url';
import { ServerResponse, IncomingMessage} from 'node:http';
import { StatusCodes, ENDPOINT, Messages } from './constants';
import { IUser, IDatabase } from '../model/interfaces';
import { UserNotFoundError } from '../model/errors';
import { IRouter } from './interfaces';
import { validateEndpoint, validateUserId } from './validators';

type HandlerCollection = object;
type ResultType = Array<IUser> | IUser | string;


export class UsersApiRouter implements IRouter {
  private database: IDatabase | undefined;
  private handlers: HandlerCollection;

  constructor() {
    this.handlers = {
      'GET': this.processGetRequest.bind(this),
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

  private getUser(url: string, res: ServerResponse): void {
    const userId = this.getUserId(url);
    if (!validateUserId(userId)) {
      this.sendResult(res, StatusCodes.BadRequest, Messages.InvalidUserId);
      return;
    }

    try {
      const user = this.database.getUser(userId);
      this.sendResult(res, StatusCodes.OK, user);
    } catch (error) {
      this.sendResult(res, StatusCodes.NotFound, Messages.UserNotFound);
    }
  }

  private sendResult(response: ServerResponse, code: number, result: ResultType): void {
    response.setHeader('Content-Type', 'application/json');
    response.writeHead(code);
    response.end(JSON.stringify(result, null, '\n'));
  }

  private getUserId(url: string): string {
    return url.slice(ENDPOINT.length + 1);
  }
}
