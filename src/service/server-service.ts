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

  constructor(host: string, defaultPort: number) {
    config();
    this.host = host;
    const port = process.env.PORT || defaultPort;
    this.port = +port;
    this.router = new UsersApiRouter();
  }

  getServer(): http.Server {
    return this.server;
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

  close(): void {
    this.server.close();
  }
}
