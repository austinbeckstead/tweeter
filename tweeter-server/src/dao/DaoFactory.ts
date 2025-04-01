import { AuthDao } from "./AuthDao";
import { FollowsDao } from "./FollowsDao";
import { UserDao } from "./UserDao";

export interface DaoFactory {
  getFollowsDAO(): FollowsDao;
  getAuthDAO(): AuthDao;
  getUserDAO(): UserDao;
}
