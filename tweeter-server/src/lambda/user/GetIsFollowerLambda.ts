import {
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
  GetUserRequest,
  GetUserResponse,
} from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
const userService = new UserService();

export const handler = async (
  request: GetIsFollowerStatusRequest
): Promise<GetIsFollowerStatusResponse> => {
  let isFollower = false;
  let errorMessage: string | undefined = undefined;
  let success = true;
  try {
    isFollower = await userService.getIsFollower(
      request.token,
      request.userAlias,
      request.selectedUserAlias
    );
  } catch (error) {
    if (error instanceof Error) errorMessage = error.message;
    else errorMessage = "An unknown Error occurred";
    success = false;
  } finally {
    return {
      success: success,
      message: errorMessage,
      isFollower: isFollower,
    };
  }
};
