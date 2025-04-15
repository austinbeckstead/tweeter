import { Status, FakeData, StatusDto, User } from "tweeter-shared";
import { AuthDao } from "../../dao/AuthDao";
import { DynamoFactory } from "../../dao/dynamo/DynamoFactory";
import { FeedDao } from "../../dao/FeedDao";
import { FollowsDao } from "../../dao/FollowsDao";
import { StoryDao } from "../../dao/StoryDao";
import { UserDao } from "../../dao/UserDao";
import { Story } from "../../entity/Story";
import { UserEntity } from "../../entity/UserEntity";
import { Feed } from "../../entity/Feed";
import {
  SQSClient,
  SendMessageCommand,
  SendMessageBatchCommand,
} from "@aws-sdk/client-sqs";
import { DataPage } from "../../entity/DataPage";
import { Follows } from "../../entity/Follows";
const SQS_POSTSTATUS =
  "https://sqs.us-west-2.amazonaws.com/905418392054/TweeterPostStatus";
const SQS_UPDATEFEED =
  "https://sqs.us-west-2.amazonaws.com/905418392054/TweeterUpdateFeed";
export class StatusService {
  sqsClient = new SQSClient();
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
  public async addStory(token: string, newStatus: StatusDto): Promise<void> {
    if ((await this.authDao.getAuth(token)) == undefined) {
      throw new Error("User Not Authenticated");
    }
    const senderAlias = newStatus.user.alias;
    const story = new Story(senderAlias, newStatus.timestamp, newStatus.post);
    await this.storyDao.addStory(story);
    const command = new SendMessageCommand({
      QueueUrl: SQS_POSTSTATUS,
      MessageBody: JSON.stringify(story),
    });
    try {
      await this.sqsClient.send(command);
    } catch {
      throw new Error("Error sending followers");
    }
  }
  public async postStatus(story: Story): Promise<void> {
    let moreItems = true;
    let lastFollowerHandle = undefined;
    let i = 0;
    let messageId = 0;
    while (moreItems) {
      console.log("CURRENT ITEMS: ", i);

      const dataPage: DataPage<Follows> =
        await this.followsDao.getPageOfFollowers(
          story.sender_alias,
          lastFollowerHandle,
          10
        );

      moreItems = dataPage.hasMorePages;
      if (moreItems == false) {
        console.log("IT RETUREND NO MORE ITEMS");
      }
      const items = dataPage.values;
      const followerPage = items.map((item) => item.follower_handle);
      i += followerPage.length; // Increment by actual number of items processed

      if (followerPage.length === 0) {
        break;
      }

      const messages = followerPage.map((follower) => ({
        Id: `msg_${messageId++}`,
        MessageBody: JSON.stringify(
          new Feed(follower, story.sender_alias, story.timestamp, story.post)
        ),
      }));

      try {
        const command = new SendMessageBatchCommand({
          QueueUrl: SQS_UPDATEFEED,
          Entries: messages,
        });
        await this.sqsClient.send(command);
      } catch (error) {
        console.error("Error sending batch to SQS:", error);
        throw new Error("Error sending followers");
      }

      // Update lastFollowerHandle with the actual last item from this page
      lastFollowerHandle =
        dataPage.values[dataPage.values.length - 1]?.follower_handle;
    }
  }
  /*public async postStatus(story: Story): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    let moreItems = true;
    let lastItem = undefined;
    let i = 0;
    while (moreItems) {
      console.log("CURRENT ITEMS: ", i);
      i += 10;
      const dataPage: DataPage<Follows> =
        await this.followsDao.getPageOfFollowers(
          story.sender_alias,
          lastItem,
          10
        );
      moreItems = dataPage.hasMorePages;
      const followerPage = dataPage.values.map(
        (value) => value.follower_handle
      );
      const messages = followerPage.map((follower, index) => ({
        Id: `msg_${index}`,
        MessageBody: JSON.stringify(
          new Feed(follower, story.sender_alias, story.timestamp, story.post)
        ),
      }));
      try {
        const command = new SendMessageBatchCommand({
          QueueUrl: SQS_UPDATEFEED,
          Entries: messages,
        });
        await this.sqsClient.send(command);
      } catch (error) {
        console.error("Error sending batch to SQS:", error);
        throw new Error("Error sending followers");
      } finally {
        lastItem = followerPage[followerPage.length - 1];
      }
    }
  }
  */
  public async addFeeds(feeds: Feed[]) {
    await this.feedDao.addFeed(feeds);
  }

  /*private async writeFollowers(story: Story): Promise<void> {
    let moreItems = true;
    let lastItem = undefined;
    //let allFollowers: string[] = [];
    while (moreItems) {
      const dataPage: DataPage<Follows> =
        await this.followsDao.getPageOfFollowers(
          story.sender_alias,
          lastItem,
          10
        );
      moreItems = dataPage.hasMorePages;
      const followerPage = dataPage.values.map(
        (value) => value.follower_handle
      );
      //allFollowers = [...allFollowers, ...followerPage];
      //lastItem = allFollowers[allFollowers.length - 1];
      const messages = followerPage.map((follower, index) => ({
        Id: `msg-${index + 1}`, // Unique ID for each message
        MessageBody: JSON.stringify(
          new Feed(follower, story.sender_alias, story.timestamp, story.post)
        ), // Customize the message content as needed
      }));
      try {
        const command = new SendMessageBatchCommand({
          QueueUrl: SQS_URL, // Your SQS Queue URL
          Entries: messages, // The batch of messages
        });
        await this.sqsClient.send(command);
      } catch {
        throw new Error("Error sending followers");
      } finally {
        lastItem = followerPage[followerPage.length - 1];
      }
    }
  }*/
}
