import { GetFollowsResponse, GetUserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
const userService = new UserService();

export const handler = async (
  request: GetUserRequest
): Promise<GetFollowsResponse> => {
  let followerCount = 0;
  let errorMessage: string | undefined = undefined;
  let success = true;
  try {
    followerCount = await userService.getFollowerCount(
      request.token,
      request.alias
    );
  } catch (error) {
    if (error instanceof Error) errorMessage = error.message;
    else errorMessage = "An unknown Error occurred";
    success = false;
  } finally {
    return {
      success: success,
      message: errorMessage,
      followsCount: followerCount,
    };
  }
};
