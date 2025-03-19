import { GetFollowsResponse, GetUserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: GetUserRequest
): Promise<GetFollowsResponse> => {
  const userService = new UserService();
  const followeeCount = await userService.getFolloweeCount(
    request.token,
    request.alias
  );
  return {
    success: true,
    message: undefined,
    followsCount: followeeCount,
  };
};
