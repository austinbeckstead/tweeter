import { AuthDao } from "../AuthDao";
import { DaoFactory } from "../DaoFactory";
import { FollowsDao } from "../FollowsDao";
import { DynamoAuthDAO } from "./DynamoAuthDao";
import { DynamoFollowsDAO } from "./DynamoFollowsDao";

export class DynamoFactory implements DaoFactory {
  getFollowsDAO(): FollowsDao {
    return new DynamoFollowsDAO();
  }
  getAuthDAO(): AuthDao {
    return new DynamoAuthDAO();
  }
}
