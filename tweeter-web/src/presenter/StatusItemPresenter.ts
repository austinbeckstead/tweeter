import { Status } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { PagedItemPresenter } from "./PagedItemPresenter";
import { View } from "./Presenter";

export interface StatusItemView extends View {
  addItems: (items: Status[]) => void;
}

export abstract class StatusItemPresenter extends PagedItemPresenter<
  Status,
  StatusService
> {
  protected createService(): StatusService {
    return new StatusService();
  }
}
