import {
  PagedUserItemRequest,
  PagedUserItemResponse,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  User,
  Status,
  PostStatusRequest,
  TweeterResponse,
  LoginUserRequest,
  LoginUserResponse,
  AuthToken,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://ecqhhxwba2.execute-api.us-west-2.amazonaws.com/dev/";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.getMoreUsers(request, "followee");
    return response;
  }
  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.getMoreUsers(request, "follower");
    return response;
  }

  public async getMoreUsers(
    request: PagedUserItemRequest,
    type: string
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, `/${type}/list`);
    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;
    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No ${type}s found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message);
    }
  }
  public async getMoreStatusItems(
    request: PagedStatusItemRequest,
    type: string
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, `/${type}/list`);
    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;
    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No ${type} found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message);
    }
  }
  public async getMoreStoryItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.getMoreStatusItems(request, "story");
    return response;
  }
  public async getMoreFeedItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.getMoreStatusItems(request, "feed");
    return response;
  }
  public async postStatus(request: PostStatusRequest): Promise<void> {
    await this.clientCommunicator.doPost<PostStatusRequest, TweeterResponse>(
      request,
      `/status/post`
    );
  }
  public async loginUser(
    request: LoginUserRequest
  ): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginUserRequest,
      LoginUserResponse
    >(request, `/user/login`);
    return [User.fromDto(response.user)!, response.token];
  }
}
