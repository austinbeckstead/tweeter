import {
  AuthToken,
  RegisterUserRequest,
  UserDto,
  UserResponse,
} from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: RegisterUserRequest
): Promise<UserResponse> => {
  const userService = new UserService();
  let message = undefined;
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
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = "An unknkown error occured";
    }
  }
  return {
    success: true,
    message: message,
    user: user,
    token: token,
  };
};
