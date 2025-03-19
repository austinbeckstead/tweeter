import {
  AuthToken,
  Status,
  FakeData,
  User,
  PagedStatusItemRequest,
  StatusDto,
  PostStatusRequest,
} from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService {
  private serverFacade: ServerFacade;
  public constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    const request = this.loadRequestInfo(authToken, user, pageSize, lastItem);
    return this.serverFacade.getMoreStoryItems(request);
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    const request = this.loadRequestInfo(authToken, user, pageSize, lastItem);
    return this.serverFacade.getMoreFeedItems(request);
  }
  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    const request: PostStatusRequest = {
      token: authToken.token,
      status: newStatus.dto,
    };
    return this.serverFacade.postStatus(request);

    // TODO: Call the server to post the status
  }

  private loadRequestInfo(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): PagedStatusItemRequest {
    const dto: StatusDto | null = lastItem
      ? {
          post: lastItem.post,
          user: lastItem.user.dto,
          timestamp: lastItem.timestamp,
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
