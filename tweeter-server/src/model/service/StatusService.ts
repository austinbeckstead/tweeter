import { Status, FakeData, StatusDto, User, UserDto } from "tweeter-shared";
import { AuthDao } from "../../dao/AuthDao";
import { DynamoFactory } from "../../dao/dynamo/DynamoFactory";
import { FeedDao } from "../../dao/FeedDao";
import { FollowsDao } from "../../dao/FollowsDao";
import { StoryDao } from "../../dao/StoryDao";
import { UserDao } from "../../dao/UserDao";
import { Feed } from "../../entity/Feed";
import { Story } from "../../entity/Story";
import { UserEntity } from "../../entity/UserEntity";

export class StatusService {
  factory = new DynamoFactory();
  storyDao: StoryDao;
  authDao: AuthDao;
  userDao: UserDao;
  feedDao: FeedDao;
  followsDao: FollowsDao;
  public constructor() {
    this.storyDao = this.factory.getStoryDAO();
    this.authDao = this.factory.getAuthDAO();
    this.userDao = this.factory.getUserDAO();
    this.feedDao = this.factory.getFeedDAO();
    this.followsDao = this.factory.getFollowsDAO();
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    if ((await this.authDao.getAuth(token)) == undefined) {
      throw new Error("User Not Authenticated");
    }
    // TODO: Replace with the result of calling server
    const dataPage = await this.storyDao.getPageOfStories(
      userAlias,
      lastItem?.timestamp,
      pageSize
    );
    const items = dataPage.values;
    const statuses: Status[] = await Promise.all(
      items.map(async (item) => {
        const userEntity: UserEntity | undefined = await this.userDao.getUser(
          item.sender_alias
        );
        const user = new User(
          userEntity!.first_name,
          userEntity!.last_name,
          userEntity!.alias,
          userEntity!.image_url
        );
        return new Status(item.post, user, item.timestamp);
      })
    );
    const dtos = statuses.map((story) => story.dto);
    return [dtos, dataPage.hasMorePages];
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    if ((await this.authDao.getAuth(token)) == undefined) {
      throw new Error("User Not Authenticated");
    }
    const dataPage = await this.feedDao.getPageOfFeed(
      userAlias,
      lastItem,
      pageSize
    );
    const senderAliases = dataPage.values.map((value) => value.sender_alias);
    const senders = await this.userDao.batchGetUsers(senderAliases);
    const feedDtos = dataPage.values.map((feedItem) => {
      const userEntity = senders.find(
        (user) => user.alias === feedItem.sender_alias
      );
      if (!userEntity) throw new Error("COULD NOT GET USER");
      const user = new User(
        userEntity!.first_name,
        userEntity!.last_name,
        userEntity!.alias,
        userEntity!.image_url
      );
      const status = new Status(feedItem.post, user, feedItem.timestamp);
      return status.dto;
    });

    return [feedDtos, dataPage.hasMorePages];
  }
  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    if ((await this.authDao.getAuth(token)) == undefined) {
      throw new Error("User Not Authenticated");
    }
    const senderAlias = newStatus.user.alias;
    const story = new Story(senderAlias, newStatus.timestamp, newStatus.post);
    await this.storyDao.addStory(story);
    const allFollowers = await this.getFollowers(senderAlias);
    for (const follower of allFollowers) {
      const feed = new Feed(
        follower,
        senderAlias,
        newStatus.timestamp,
        newStatus.post
      );
      await this.feedDao.addFeed(feed);
    }
  }
  private async getFollowers(alias: string): Promise<string[]> {
    let moreItems = true;
    let lastItem = undefined;
    let allFollowers: string[] = [];
    while (moreItems) {
      const dataPage = await this.followsDao.getPageOfFollowers(
        alias,
        lastItem,
        2
      );
      moreItems = dataPage.hasMorePages;
      const followerPage = dataPage.values.map(
        (value) => value.follower_handle
      );
      allFollowers = [...allFollowers, ...followerPage];
      lastItem = allFollowers[allFollowers.length - 1];
    }
    return allFollowers;
  }
}
