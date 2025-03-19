import { PagedUserItemResponse, PagedUserItemRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
export const handler = async (
  request: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
  const followService = new FollowService();
  const [items, hasMore] = await followService.loadMoreFollowers(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );
  return {
    success: true,
    message: undefined,
    items: items,
    hasMore: hasMore,
  };
};
