interface IUser {
  id?: string;
  username: string;
  age: number;
  hobbies: Array<string>;
};

interface IDatabase {
  getUsers(): Array<IUser>;
};

export {
  IUser,
  IDatabase,
}
