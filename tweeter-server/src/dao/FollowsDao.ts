import { DataPage } from "../entity/DataPage";
import { Follows } from "../entity/Follows";

export interface FollowsDao {
  addFollows(follows: Follows): Promise<void>;
  deleteFollows(follows: Follows): Promise<void>;
  getPageOfFollowees(
    follower_handle: string,
    lastItem: string | undefined,
    limit: number
  ): Promise<DataPage<Follows>>;
  getPageOfFollowers(
    followee_handle: string,
    lastItem: string | undefined,
    limit: number
  ): Promise<DataPage<Follows>>;
  getFollows(follows: Follows): Promise<Follows | undefined>;
  getClientConfig(): any;
  getNumFollowees(token: string, follower_handle: string): Promise<number>;
  getNumFollowers(token: string, followee_handle: string): Promise<number>;
}
