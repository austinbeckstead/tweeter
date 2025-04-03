import { UserEntity } from "../entity/UserEntity";

export interface UserDao {
  addUser(user: UserEntity): Promise<void>;
  deleteUser(user: UserEntity): Promise<void>;
  getUser(alias: string): Promise<UserEntity | undefined>;
  batchGetUsers(aliases: string[]): Promise<UserEntity[]>;
}
