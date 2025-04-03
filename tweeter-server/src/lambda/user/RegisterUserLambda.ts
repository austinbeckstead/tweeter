import {
  AuthToken,
  RegisterUserRequest,
  UserDto,
  UserResponse,
} from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
const userService = new UserService();

export const handler = async (
  request: RegisterUserRequest
): Promise<UserResponse> => {
  let success = true;
  let errorMessage = undefined;
  let user: UserDto | null = null;
  let token: AuthToken | null = null;
  try {
    [user, token] = await userService.register(
      request.firstName,
      request.lastName,
      request.alias,
      request.password,
      request.userImageBytes,
      request.imageFileExtension
    );
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
