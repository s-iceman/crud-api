import { ServerService } from './service/server-service';
import { IServerService } from './service/interfaces';
import { HOST, DEFAULT_PORT } from './configs/settings';
import { UserDatabase } from './model/database';
import { IDatabase } from './model/interfaces';


const db: IDatabase = new UserDatabase();
const server: IServerService = new ServerService(HOST, DEFAULT_PORT);

server.connect(db);
server.start();
