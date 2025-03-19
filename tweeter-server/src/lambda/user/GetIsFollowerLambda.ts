import {
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
  GetUserRequest,
  GetUserResponse,
} from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: GetIsFollowerStatusRequest
): Promise<GetIsFollowerStatusResponse> => {
  const userService = new UserService();
  const isFollower = await userService.getIsFollower(
    request.token,
    request.userAlias,
    request.selectedUserAlias
  );
  return {
    success: true,
    message: undefined,
    isFollower: isFollower,
  };
};
