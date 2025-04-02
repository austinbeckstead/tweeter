import { Status, FakeData, StatusDto, User } from "tweeter-shared";
import { AuthDao } from "../../dao/AuthDao";
import { DynamoFactory } from "../../dao/dynamo/DynamoFactory";
import { StoryDao } from "../../dao/StoryDao";
import { UserDao } from "../../dao/UserDao";
import { Story } from "../../entity/Story";
import { UserEntity } from "../../entity/UserEntity";

export class StatusService {
  factory = new DynamoFactory();
  storyDao: StoryDao;
  authDao: AuthDao;
  userDao: UserDao;

  public constructor() {
    this.storyDao = this.factory.getStoryDAO();
    this.authDao = this.factory.getAuthDAO();
    this.userDao = this.factory.getUserDAO();
  }
  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
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
          ""
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
    return this.getFakeData(token, lastItem, userAlias, pageSize);
  }
  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    const story = new Story(
      newStatus.user.alias,
      newStatus.timestamp,
      newStatus.post
    );
    await this.storyDao.addStory(story);

    //TODO: add to preloaded feeds
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  }
  private async getFakeData(
    token: string,
    lastItem: StatusDto | null,
    userAlias: string,
    pageSize: number
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize
    );
    const dtos = items.map((status) => status.dto);
    return [dtos, hasMore];
  }
}
