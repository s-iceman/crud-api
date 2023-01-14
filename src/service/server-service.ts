import * as http from 'node:http';
import { config } from 'dotenv';

import { IServerService, IRouter } from './interfaces';
import { UsersApiRouter } from './routing';
import { IDatabase } from '../model/interfaces';


export class ServerService implements IServerService {
  private server: http.Server;

  private host: string;
  private port: number;

  private database: IDatabase | undefined;
  private router: IRouter;

  constructor(host: string, defalutPort: number) {
    config();
    this.host = host;
    this.port = +process.env.PORT || defalutPort;
    this.router = new UsersApiRouter();
  }

  connect(database: IDatabase): void {
    this.database = database;
    this.router.connect(database);
  }

  start() {
    this.server = http.createServer(this.router.route.bind(this.router));
    this.server.listen(this.port, this.host, () => {
      console.log(
        `Server is running on http://${this.host}:${this.port}`
      );
    });
  }
};
