import { AuthToken, Status, User } from "tweeter-shared";
import { PAGE_SIZE } from "./PagedItemPresenter";
import { StatusItemPresenter } from "./StatusItemPresenter";

export class FeedItemPresenter extends StatusItemPresenter {
  protected getMoreItems(
    authToken: AuthToken,
    user: User
  ): Promise<[Status[], boolean]> {
    return this.service.loadMoreFeedItems(
      authToken,
      user,
      PAGE_SIZE,
      this.lastItem
    );
  }
  protected getItemDescription(): string {
    return "load feed items";
  }
}
