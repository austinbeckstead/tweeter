import { AuthToken, User } from "tweeter-shared";
import { PAGE_SIZE } from "./PagedItemPresenter";
import { UserItemPresenter } from "./UserItemPresenter";

export class FolloweePresenter extends UserItemPresenter {
  protected getMoreItems(
    authToken: AuthToken,
    user: User
  ): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowees(
      authToken,
      user,
      PAGE_SIZE,
      this.lastItem
    );
  }
  protected getItemDescription(): string {
    return "load followees";
  }
}
