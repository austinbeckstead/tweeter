import { StatusDto } from "tweeter-shared";
import { DataPage } from "../entity/DataPage";
import { Feed } from "../entity/Feed";

export interface FeedDao {
  addFeed(feed: Feed[]): Promise<void>;
  getPageOfFeed(
    receiver_alias: string,
    lastItem: StatusDto | null,
    limit: number
  ): Promise<DataPage<Feed>>;
}
