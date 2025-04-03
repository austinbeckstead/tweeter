import { GetUserRequest, GetUserResponse, UserDto } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
const userService = new UserService();

export const handler = async (
  request: GetUserRequest
): Promise<GetUserResponse> => {
  let user: UserDto | null = null;
  let errorMessage: string | undefined = undefined;
  let success = true;
  try {
    user = await userService.getUser(request.token, request.alias);
  } catch (error) {
    if (error instanceof Error) errorMessage = error.message;
    else errorMessage = "An unknown Error occurred";
    success = false;
  } finally {
    return {
      success: success,
      message: errorMessage,
      user: user,
    };
  }
};
