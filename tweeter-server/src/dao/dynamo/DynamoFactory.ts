import { AuthDao } from "../AuthDao";
import { DaoFactory } from "../DaoFactory";
import { FeedDao } from "../FeedDao";
import { FollowsDao } from "../FollowsDao";
import { ImageDao } from "../ImageDao";
import { StoryDao } from "../StoryDao";
import { UserDao } from "../UserDao";
import { DynamoAuthDAO } from "./DynamoAuthDao";
import { DynamoFeedDAO } from "./DynamoFeedDao";
import { DynamoFollowsDAO } from "./DynamoFollowsDao";
import { DynamoStoryDAO } from "./DynamoStoryDao";
import { DynamoUserDAO } from "./DynamoUserDao";
import { S3ImageDao } from "./S3ImageDao";

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
  getStoryDAO(): StoryDao {
    return new DynamoStoryDAO();
  }
  getImageDAO(): ImageDao {
    return new S3ImageDao();
  }
  getFeedDAO(): FeedDao {
    return new DynamoFeedDAO();
  }
}
