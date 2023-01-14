import { IUser } from './user';

class UsersDB {
  private users: Map<string, IUser>;

  constructor() {
    this.users = new Map();
    this.users.set('1', {age: 13, username: 'Ivan', hobbies: []});
  }

  getUsers() {
    const users = [];
    this.users.forEach((value, key) => {
        users.push({id: key, ...value});
    });
    return JSON.stringify(users);
  }
};

const db = new UsersDB();


export {
  db,
}