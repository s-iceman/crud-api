import { IncomingMessage, ServerResponse } from 'http';
import { IDatabase } from '../model/interfaces';


interface IServerService {
  start() : void;
  connect(database: IDatabase): void,
}

interface IRouter {
  connect(database: IDatabase): void;
  route(req: IncomingMessage, res: ServerResponse): void;
}

export {
  IServerService,
  IRouter,
}
