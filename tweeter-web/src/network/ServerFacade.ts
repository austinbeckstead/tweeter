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
  UserResponse,
  AuthToken,
  RegisterUserRequest,
  GetUserRequest,
  GetUserResponse,
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
  GetFollowsResponse,
  FollowUserResponse,
  LogoutUserRequest,
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
    handleError(response);
    if (items == null) {
      throw new Error(`No ${type}s found`);
    } else {
      return [items, response.hasMore];
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
    handleError(response);
    if (items == null) {
      throw new Error(`No ${type} found`);
    } else {
      return [items, response.hasMore];
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
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
    >(request, `/status/post`);
    handleError(response);
  }
  public async loginUser(
    request: LoginUserRequest
  ): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginUserRequest,
      UserResponse
    >(request, `/user/login`);
    handleError(response);
    if (!response.user || !response.token)
      throw new Error("An Unknown Error Occured");
    const authToken = AuthToken.fromJson(JSON.stringify(response.token));
    const user = User.fromDto(response.user);

    return [user!, authToken!];
  }
  public async registerUser(
    request: RegisterUserRequest
  ): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterUserRequest,
      UserResponse
    >(request, `/user/register`);
    handleError(response);
    if (!response.user || !response.token)
      throw new Error("An Unknown Error Occured");
    const authToken = AuthToken.fromJson(JSON.stringify(response.token));
    const user = User.fromDto(response.user);
    return [user!, authToken!];
  }
  public async getUser(request: GetUserRequest): Promise<User> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, `/user/get`);
    handleError(response);
    if (response.user == null) throw new Error("An Unknown Error Occured");
    return User.fromDto(response.user)!;
  }
  public async getIsFollower(
    request: GetIsFollowerStatusRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      GetIsFollowerStatusRequest,
      GetIsFollowerStatusResponse
    >(request, `/user/getIsFollower`);
    handleError(response);
    return response.isFollower;
  }
  public async getFolloweeCount(request: GetUserRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetFollowsResponse
    >(request, `/user/getFolloweeCount`);
    handleError(response);
    return response.followsCount;
  }
  public async getFollowerCount(request: GetUserRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetFollowsResponse
    >(request, `/user/getFollowerCount`);
    handleError(response);
    return response.followsCount;
  }
  public async followUser(request: GetUserRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      FollowUserResponse
    >(request, `/user/follow`);
    handleError(response);
    return [response.followerCount, response.followeeCount];
  }
  public async unfollowUser(
    request: GetUserRequest
  ): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      FollowUserResponse
    >(request, `/user/unfollow`);
    handleError(response);
    return [response.followerCount, response.followeeCount];
  }
  public async logoutUser(request: LogoutUserRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutUserRequest,
      TweeterResponse
    >(request, `/user/logout`);
    handleError(response);
  }
}
function handleError(response: TweeterResponse): void {
  if (response.success == false) {
    console.error(response);
    throw new Error(response.message);
  }
}
