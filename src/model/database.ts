import { v4 } from 'uuid';
import { IUser, IDatabase } from './interfaces';
import { UserNotFoundError } from './errors';


export class UserDatabase implements IDatabase {
  private users: Map<string, IUser>;

  constructor() {
    this.users = new Map();
  }

  getUsers(): Array<IUser> {
    const users = [];
    this.users.forEach((value, key) => {
        users.push({id: key, ...value});
    });
    return users;
  }

  getUser(user: IUser): IUser | never {
    const {id: userId} = user;
    if (this.users.has(userId)) {
      return {id: userId, ...this.users.get(userId)};
    }
    throw new UserNotFoundError();
  }

  createUser(user: IUser): IUser {
    const userId = this.generateId();
    this.users.set(userId, user);
    return {id: userId, ...user};
  }

  updateUser(user: IUser): IUser | never {
    const {id: userId, ...updatedUser} = user;
    if (!this.users.has(userId)) {
      throw new UserNotFoundError();
    }
    this.users.set(userId, updatedUser);
    return user;
  }

  deleteUser(user: IUser): void | never {
    const {id: userId} = user;
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
