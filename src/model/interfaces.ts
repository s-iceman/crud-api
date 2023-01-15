interface IUser {
  id?: string;
  username?: string;
  age?: number;
  hobbies?: Array<string>;
};

interface IDatabase {
  getUsers(): Array<IUser>;
  getUser(user: IUser): IUser | never;
  deleteUser(user: IUser): void | never;
  createUser(user: IUser): IUser;
  updateUser(user: IUser): IUser | never;
};

export {
  IUser,
  IDatabase,
}
