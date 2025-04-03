import {
  LogoutUserRequest,
  TweeterResponse,
  UserResponse,
} from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
const userService = new UserService();

export const handler = async (
  request: LogoutUserRequest
): Promise<TweeterResponse> => {
  await userService.logout(request.token);
  return {
    success: true,
    message: undefined,
  };
};
