import { IUser, IDatabase } from './interfaces';
import { v4 } from 'uuid';


export class UserDatabase implements IDatabase {
  private users: Map<string, IUser>;

  constructor() {
    this.users = new Map();
    this.users.set(this.generateId(),
      {age: 13, username: 'Ivan', hobbies: []}
    );
  }

  getUsers(): Array<IUser> {
    const users = [];
    this.users.forEach((value, key) => {
        users.push({id: key, ...value});
    });
    return users;
  }

  private generateId(): string {
    while (true) {
      const userId = v4();
      if (!this.users.has(userId)) {
        return userId;
      }
    }
  }
};
