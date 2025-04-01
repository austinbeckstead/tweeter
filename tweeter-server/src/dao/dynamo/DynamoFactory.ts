import { AuthDao } from "../AuthDao";
import { DaoFactory } from "../DaoFactory";
import { FollowsDao } from "../FollowsDao";
import { UserDao } from "../UserDao";
import { DynamoAuthDAO } from "./DynamoAuthDao";
import { DynamoFollowsDAO } from "./DynamoFollowsDao";
import { DynamoUserDAO } from "./DynamoUserDao";

export class DynamoFactory implements DaoFactory {
  getFollowsDAO(): FollowsDao {
    return new DynamoFollowsDAO();
  }
  getAuthDAO(): AuthDao {
    return new DynamoAuthDAO();
  }
  getUserDAO(): UserDao {
    return new DynamoUserDAO();
  }
}
