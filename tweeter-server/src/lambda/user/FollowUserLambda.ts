import { FollowUserResponse, GetUserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
const userService = new UserService();

export const handler = async (
  request: GetUserRequest
): Promise<FollowUserResponse> => {
  let followerCount = 0;
  let followeeCount = 0;
  let errorMessage: string | undefined = undefined;
  let success = true;
  try {
    [followerCount, followeeCount] = await userService.follow(
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
      followerCount: followerCount,
      followeeCount: followeeCount,
    };
  }
};
