import { FollowUserResponse, GetUserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: GetUserRequest
): Promise<FollowUserResponse> => {
  const userService = new UserService();
  const [followerCount, followeeCount] = await userService.follow(
    request.token,
    request.alias
  );
  return {
    success: true,
    message: undefined,
    followerCount: followerCount,
    followeeCount: followeeCount,
  };
};
