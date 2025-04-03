import {
  AuthToken,
  LoginUserRequest,
  UserDto,
  UserResponse,
} from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
const userService = new UserService();

export const handler = async (
  request: LoginUserRequest
): Promise<UserResponse> => {
  let success = true;
  let errorMessage = undefined;
  let user: UserDto | null = null;
  let token: AuthToken | null = null;
  try {
    [user, token] = await userService.login(request.alias, request.password);
  } catch (error) {
    success = false;
    if (error instanceof Error) errorMessage = error.message;
    else errorMessage = "An unknkown error occured";
  } finally {
    return {
      success: success,
      message: errorMessage,
      user: user,
      token: token,
    };
  }
};
