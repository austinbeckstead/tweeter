import { User, FakeData, UserDto } from "tweeter-shared";
import { AuthDao } from "../../dao/AuthDao";
import { DynamoFactory } from "../../dao/dynamo/DynamoFactory";
import { FollowsDao } from "../../dao/FollowsDao";
import { UserDao } from "../../dao/UserDao";
import { DataPage } from "../../entity/DataPage";
import { Follows } from "../../entity/Follows";
import { UserEntity } from "../../entity/UserEntity";

export class FollowService {
  factory = new DynamoFactory();
  followsDao: FollowsDao;
  userDao: UserDao;
  authDao: AuthDao;
  public constructor() {
    this.followsDao = this.factory.getFollowsDAO();
    this.userDao = this.factory.getUserDAO();
    this.authDao = this.factory.getAuthDAO();
  }
  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    if ((await this.authDao.getAuth(token)) == undefined) {
      throw new Error("User Not Authenticated");
    }
    const dataPage = await this.followsDao.getPageOfFollowers(
      userAlias,
      lastItem?.alias,
      pageSize
    );

    const items = dataPage.values;
    const entities = await Promise.all(
      items.map(
        async (item) => await this.userDao.getUser(item.follower_handle)
      )
    );
    return this.getDtos(entities, dataPage.hasMorePages);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    if ((await this.authDao.getAuth(token)) == undefined) {
      throw new Error("User Not Authenticated");
    }
    // TODO: Replace with the result of calling server
    const dataPage = await this.followsDao.getPageOfFollowees(
      userAlias,
      lastItem?.alias,
      pageSize
    );
    const items = dataPage.values;
    const entities = await Promise.all(
      items.map(
        async (item) => await this.userDao.getUser(item.followee_handle)
      )
    );
    return this.getDtos(entities, dataPage.hasMorePages);
  }

  private async getDtos(
    entities: (UserEntity | undefined)[],
    hasMore: boolean
  ): Promise<[UserDto[], boolean]> {
    const users = entities.map((entity: UserEntity | undefined) =>
      entity
        ? new User(
            entity.first_name,
            entity.last_name,
            entity.alias,
            entity.image_url
          )
        : null
    );

    const dtos = users
      .filter((user): user is User => user !== null)
      .map((user) => user.dto);
    return [dtos, hasMore];
  }
}
