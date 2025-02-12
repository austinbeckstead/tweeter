import { AuthToken, Status } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { StatusService } from "../model/service/StatusService";

export interface StatusItemView {
  addItems: (newItems: Status[]) => void;
  displayErrorMessage: (message: string) => void;
}
export abstract class StatusItemPresenter {
  private _hasMoreItems = true;
  private _lastItem: Status | null = null;
  private _view: StatusItemView;

  protected constructor(view: StatusItemView) {
    this._view = view;
  }
  protected get view() {
    return this._view;
  }
  protected get lastItem() {
    return this._lastItem;
  }
  protected set lastItem(value: Status | null) {
    this._lastItem = value;
  }
  public get hasMoreItems() {
    return this._hasMoreItems;
  }
  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }
  reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
