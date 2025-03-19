import {
  AuthToken,
  User,
  FakeData,
  PagedUserItemRequest,
  UserDto,
} from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {
  private serverFacade: ServerFacade;
  public constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    const request = this.loadRequestInfo(authToken, user, pageSize, lastItem);
    return this.serverFacade.getMoreFollowers(request);
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    const request = this.loadRequestInfo(authToken, user, pageSize, lastItem);
    return this.serverFacade.getMoreFollowees(request);
  }
  private loadRequestInfo(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): PagedUserItemRequest {
    const dto: UserDto | null = lastItem
      ? {
          firstName: lastItem.firstName,
          lastName: lastItem.lastName,
          alias: lastItem.alias,
          imageUrl: lastItem.imageUrl,
        }
      : null;
    const request = {
      token: authToken.token,
      userAlias: user.alias,
      pageSize: pageSize,
      lastItem: dto,
    };
    return request;
  }
}
