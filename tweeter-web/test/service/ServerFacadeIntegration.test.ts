import {
  GetUserRequest,
  PagedUserItemRequest,
  RegisterUserRequest,
  UserDto,
} from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch";

describe("Server Facade", () => {
  let serverFacade: ServerFacade;
  beforeAll(() => {
    serverFacade = new ServerFacade();
  });
  it("Registers a User", async () => {
    const request: RegisterUserRequest = {
      firstName: "First",
      lastName: "Last",
      alias: "alias",
      password: "password",
      userImageBytes: "imageStringBase64",
      imageFileExtension: "imageFileExtension",
    };
    const [user, token] = await serverFacade.registerUser(request);
    expect(user.alias).toBe("@allen");
    expect(token).not.toBe(null);
  });
  it("Gets Followers", async () => {
    const dto: UserDto = {
      firstName: "first",
      lastName: "last",
      alias: "alias",
      imageUrl: "imageUrl",
    };
    const request: PagedUserItemRequest = {
      token: "token",
      userAlias: "alias",
      pageSize: 2,
      lastItem: dto,
    };

    const [users, hasMore] = await serverFacade.getMoreFollowers(request);
    expect(users[0].alias).toBe("@allen");
    expect(hasMore).toBe(true);
  });
  it("Gets Follower Count", async () => {
    const request: GetUserRequest = {
      token: "token",
      alias: "@allen",
    };
    const followerCount = await serverFacade.getFollowerCount(request);
    expect(followerCount).not.toBe(null);
  });
});
