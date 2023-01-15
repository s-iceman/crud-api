interface IUser {
  id?: string;
  username: string;
  age: number;
  hobbies: Array<string>;
};

interface IDatabase {
  getUsers(): Array<IUser>;
  getUser(userId: string): IUser | never;
  deleteUser(userId: string): void | never;
  createUser(user: IUser): IUser;
  updateUser(user: IUser): IUser | never;
};

export {
  IUser,
  IDatabase,
}
