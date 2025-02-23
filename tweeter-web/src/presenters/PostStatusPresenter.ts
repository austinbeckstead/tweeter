import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  authToken: AuthToken | null;
}
export class PostStatusPresenter extends Presenter<PostStatusView> {
  private statusService: StatusService;
  private _isLoading = false;
  public constructor(view: PostStatusView) {
    super(view);
    this.statusService = new StatusService();
  }

  public get isLoading() {
    return this._isLoading;
  }
  submitPost = async (post: string, currentUser: User | null) => {
    this.doFailureReportingOperation(async () => {
      this._isLoading = true;
      this.view.displayInfoMessage("Posting status...", 0);
      const status = new Status(post, currentUser!, Date.now());
      await this.statusService.postStatus(this.view.authToken!, status);
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status");
    this.view.clearLastInfoMessage();
    this._isLoading = false;
  };
}
