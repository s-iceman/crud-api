import * as http from 'node:http';
import { config } from 'dotenv';
import { IServerSettings } from './interfaces';
import { route } from './routing';


export class ServerService implements IServerSettings {
  private server: http.Server;
  private host: string;
  private port: number;

  constructor(host: string, defalutPort: number) {
    config();
    this.host = host;
    this.port = +process.env.PORT || defalutPort;
  }

  start() {
    const requestListener = function (req: http.IncomingMessage, res: http.ServerResponse) {
      const result = route(req);
      
      res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end(`{"message": "This is a JSON response: ${result}"}`);
    };

    this.server = http.createServer(requestListener);
    this.server.listen(this.port, this.host, () => {
      console.log(`Server is running on http://${this.host}:${this.port}`);
    });
  }

};
