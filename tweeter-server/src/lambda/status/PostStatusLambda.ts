import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
const statusService = new StatusService();
const SQS_URL =
  "https://sqs.us-west-2.amazonaws.com/905418392054/TweeterPostStatus";
const sqsClient = new SQSClient();

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  let errorMessage: string | undefined = undefined;
  let success = true;
  try {
    await statusService.addStory(request.token, request.status);
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
