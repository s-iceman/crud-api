import * as http from 'node:http';
import { IncomingMessage, ServerResponse } from 'http';
import { IDatabase } from '../model/interfaces';


interface IServerService {
  start(): void;
  connect(database: IDatabase): void;
  close(): void;
  getServer(): http.Server;
}

interface IRouter {
  connect(database: IDatabase): void;
  route(req: IncomingMessage, res: ServerResponse): Promise<void>;
}

export {
  IServerService,
  IRouter,
}
