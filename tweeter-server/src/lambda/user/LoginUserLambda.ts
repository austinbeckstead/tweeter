import { LoginUserRequest, LoginUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: LoginUserRequest
): Promise<LoginUserResponse> => {
  const userService = new UserService();
  const [user, token] = await userService.login(
    request.alias,
    request.password
  );
  return {
    success: true,
    message: undefined,
    user: user,
    token: token,
  };
};
