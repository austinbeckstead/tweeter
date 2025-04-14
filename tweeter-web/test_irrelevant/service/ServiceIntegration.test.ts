import {
  AuthToken,
  PagedUserItemRequest,
  Status,
  StatusDto,
  User,
  UserDto,
} from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";
import "isomorphic-fetch";

describe("Server Facade", () => {
  let statusService: StatusService;
  beforeAll(() => {
    statusService = new StatusService();
  });
  it("Gets a User's Story Pages", async () => {
    const userDto: UserDto = {
      firstName: "FirstName",
      lastName: "LastName",
      alias: "alias",
      imageUrl: "imageUrl",
    };
    const user = User.fromDto(userDto)!;
    const authToken = new AuthToken("STRING", 1);
    const [statuses, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      User.fromDto(userDto)!,
      54,
      null
    );
    expect(statuses[0].user.alias).toBe("@allen");
    expect(hasMore).toBe(false);
    const dto: StatusDto = statuses[1];
    const [statuses2, hasMore2] = await statusService.loadMoreStoryItems(
      authToken,
      User.fromDto(userDto)!,
      2,
      Status.fromDto(dto)
    );
    expect(statuses2[0].user.alias).toBe("@bob");
    expect(hasMore2).toBe(true);
  });
});
