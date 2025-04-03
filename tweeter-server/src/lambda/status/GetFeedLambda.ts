import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  StatusDto,
} from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
const statusService = new StatusService();

export const handler = async (
  request: PagedStatusItemRequest
): Promise<PagedStatusItemResponse> => {
  let items: StatusDto[] = [];
  let hasMore = false;
  let errorMessage: string | undefined = undefined;
  let success = true;
  try {
    [items, hasMore] = await statusService.loadMoreFeedItems(
      request.token,
      request.userAlias,
      request.pageSize,
      request.lastItem
    );
  } catch (error) {
    if (error instanceof Error) errorMessage = error.message;
    else errorMessage = "An unknown Error occurred";
    success = false;
  } finally {
    return {
      success: success,
      message: errorMessage,
      items: items,
      hasMore: hasMore,
    };
  }
};
