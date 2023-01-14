import { ServerService } from './service/server-service';
import { HOST, DEFAULT_PORT } from './configs/settings';


const server = new ServerService(HOST, DEFAULT_PORT);
server.start();
