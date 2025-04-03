import {
  PagedUserItemResponse,
  PagedUserItemRequest,
  UserDto,
} from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
const followService = new FollowService();

export const handler = async (
  request: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
  let items: UserDto[] = [];
  let hasMore = false;
  let errorMessage: string | undefined = undefined;
  let success = true;
  try {
    [items, hasMore] = await followService.loadMoreFollowers(
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
