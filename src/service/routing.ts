import * as url from 'url';
import { ServerResponse, IncomingMessage} from 'node:http';
import { StatusCodes, ENDPOINT } from '../constants';
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

    const handler = this.handlers[req.method];
    if (handler) {
      const reqUrl = url.parse(req.url).pathname;
      handler(reqUrl, req, res);
    }
      /*
          if(reqUrl == "/") {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(400);
        res.end(`{"message": "This is a JSON response: ERROR"}`);
     }
    */
    };

  private processGetRequest(url: string, req: IncomingMessage, res: ServerResponse): void {
    if (!validate(url)) {
      return;
    }

    if (url == ENDPOINT) {
      this.getUsers(res);
    }
  }

  private getUsers(res: ServerResponse): void {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(StatusCodes.OK);
    res.end(JSON.stringify(this.database.getUsers(), null, '\n'));
  }
}
