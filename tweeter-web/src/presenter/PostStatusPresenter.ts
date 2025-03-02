import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  authToken: AuthToken | null;
  clearPost: () => void;
}
export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _statusService: StatusService | null = null;
  private _isLoading = false;
  public constructor(view: PostStatusView) {
    super(view);
  }

  public get isLoading() {
    return this._isLoading;
  }
  public get statusService() {
    if (this._statusService == null) {
      this._statusService = new StatusService();
    }
    return this._statusService;
  }
  public submitPost = async (post: string, currentUser: User | null) => {
    this.view.displayInfoMessage("Posting status...", 0);
    this.doFailureReportingOperation(async () => {
      this._isLoading = true;
      const status = new Status(post, currentUser!, Date.now());
      await this.statusService.postStatus(this.view.authToken!, status);
      this.view.displayInfoMessage("Status posted!", 2000);
      this.view.clearPost();
      this.view.clearLastInfoMessage();
    }, "post the status");
    this._isLoading = false;
  };
}
