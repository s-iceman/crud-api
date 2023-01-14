import { v4 } from 'uuid';
import { IUser, IDatabase } from './interfaces';
import { UserNotFoundError } from './errors';


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

  getUser(userId: string): IUser | never {
    if (this.users.has(userId)) {
      return {id: userId, ...this.users.get(userId)};
    }
    throw new UserNotFoundError();
  }

  deleteUser(userId: string): void | never {
    if (!this.users.has(userId)) {
      throw new UserNotFoundError();
    }
    this.users.delete(userId);
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
