import { RegisterUserRequest, UserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: RegisterUserRequest
): Promise<UserResponse> => {
  const userService = new UserService();
  const [user, token] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
  );
  return {
    success: true,
    message: undefined,
    user: user,
    token: token,
  };
};
