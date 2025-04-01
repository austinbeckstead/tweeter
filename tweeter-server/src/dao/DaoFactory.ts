import { AuthDao } from "./AuthDao";
import { FollowsDao } from "./FollowsDao";

export interface DaoFactory {
  getFollowsDAO(): FollowsDao;
  getAuthDAO(): AuthDao;
}
