import { AuthDao } from "./AuthDao";
import { FeedDao } from "./FeedDao";
import { FollowsDao } from "./FollowsDao";
import { ImageDao } from "./ImageDao";
import { StoryDao } from "./StoryDao";
import { UserDao } from "./UserDao";

export interface DaoFactory {
  getFollowsDAO(): FollowsDao;
  getAuthDAO(): AuthDao;
  getUserDAO(): UserDao;
  getStoryDAO(): StoryDao;
  getImageDAO(): ImageDao;
  getFeedDAO(): FeedDao;
}
