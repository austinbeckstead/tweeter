import {
  LogoutUserRequest,
  TweeterResponse,
  UserResponse,
} from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: LogoutUserRequest
): Promise<TweeterResponse> => {
  const userService = new UserService();
  await userService.logout(request.token);
  return {
    success: true,
    message: undefined,
  };
};
