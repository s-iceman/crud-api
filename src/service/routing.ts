import * as url from 'url';
import * as http from 'node:http';
import { IUser } from '../model/user';
import { db } from '../model/database';


export const route = (req: http.IncomingMessage): string => {
  const reqUrl = url.parse(req.url).pathname
    if(reqUrl == "/") {
      return 'ERROR';
    }
    else if(reqUrl == "/users") {
      return `Process endpoint USERS: ${db.getUsers()}`;
    }
};
