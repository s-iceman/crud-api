import * as url from 'url';
import { ServerResponse, IncomingMessage} from 'node:http';
import { StatusCodes, ENDPOINT, Messages } from './constants';
import { IUser, IDatabase } from '../model/interfaces';
import { IRouter } from './interfaces';
import { validate } from './validators';

type HandlerCollection = object;


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
    if (!validate(reqUrl)) {
      this.sendError(res);
      return;
    }

    const handler = this.handlers[req.method];
    if (handler) {
      handler(reqUrl, req, res);
    }
  };

  private processGetRequest(url: string, req: IncomingMessage, res: ServerResponse): void {
    if (url == ENDPOINT) {
      this.getUsers(res);
    }
  }

  private getUsers(res: ServerResponse): void {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(StatusCodes.OK);
    res.end(JSON.stringify(this.database.getUsers(), null, '\n'));
  }

  private sendError(res: ServerResponse): void {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(StatusCodes.NotFound);
    res.end(JSON.stringify(Messages.NotFound));
  }
}
