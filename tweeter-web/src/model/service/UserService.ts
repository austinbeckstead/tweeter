import {
  User,
  AuthToken,
  FakeData,
  LoginUserRequest,
  RegisterUserRequest,
  GetUserRequest,
  GetIsFollowerStatusRequest,
  LogoutUserRequest,
} from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
  private serverFacade: ServerFacade;
  public constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const request: LoginUserRequest = {
      alias: alias,
      password: password,
    };
    return this.serverFacade.loginUser(request);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const request: RegisterUserRequest = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBytes: imageStringBase64,
      imageFileExtension: imageFileExtension,
    };
    return this.serverFacade.registerUser(request);
  }
  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    const request: GetUserRequest = {
      token: authToken.token,
      alias: alias,
    };
    return this.serverFacade.getUser(request);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    const request: GetIsFollowerStatusRequest = {
      token: authToken.token,
      userAlias: user.alias,
      selectedUserAlias: selectedUser.alias,
    };
    return this.serverFacade.getIsFollower(request);
  }
  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    const request: GetUserRequest = {
      //token: authToken.token,
      token: authToken.token,
      alias: user.alias,
    };
    return this.serverFacade.getFolloweeCount(request);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    const request: GetUserRequest = {
      //token: authToken.token,
      token: authToken.token,

      alias: user.alias,
    };
    return this.serverFacade.getFollowerCount(request);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    const request: GetUserRequest = {
      //token: authToken.token,
      token: authToken.token,

      alias: userToFollow.alias,
    };
    // TODO: Call the server
    return this.serverFacade.followUser(request);
  }
  public async unfollow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    const request: GetUserRequest = {
      //token: authToken.token,
      token: authToken.token,
      alias: userToFollow.alias,
    };
    // TODO: Call the server
    return this.serverFacade.unfollowUser(request);
  }
  public async logout(authToken: AuthToken): Promise<void> {
    const request: LogoutUserRequest = {
      token: authToken.token,
    };
    return this.serverFacade.logoutUser(request);
  }
}
