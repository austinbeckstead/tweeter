import { User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { PagedItemPresenter } from "./PagedItemPresenter";
import { View } from "./Presenter";
export const PAGE_SIZE = 10;
export interface UserItemView extends View {
  addItems: (items: User[]) => void;
}
export abstract class UserItemPresenter extends PagedItemPresenter<
  User,
  FollowService
> {
  protected createService(): FollowService {
    return new FollowService();
  }
}
