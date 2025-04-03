import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
const statusService = new StatusService();

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  let errorMessage: string | undefined = undefined;
  let success = true;
  try {
    await statusService.postStatus(request.token, request.status);
  } catch (error) {
    if (error instanceof Error) errorMessage = error.message;
    else errorMessage = "An unknown Error occurred";
    success = false;
  } finally {
    return {
      success: success,
      message: errorMessage,
    };
  }
};
