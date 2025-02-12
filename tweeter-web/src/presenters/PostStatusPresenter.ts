import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface PostStatusView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
  authToken: AuthToken | null;
}
export class PostStatusPresenter {
  private statusService: StatusService;
  private _isLoading = false;
  private view: PostStatusView;
  public constructor(view: PostStatusView) {
    this.view = view;
    this.statusService = new StatusService();
  }
  submitPost = async (post: string, currentUser: User | null) => {
    try {
      this._isLoading = true;
      this.view.displayInfoMessage("Posting status...", 0);
      const status = new Status(post, currentUser!, Date.now());
      await this.statusService.postStatus(this.view.authToken!, status);
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this._isLoading = false;
    }
  };
  public get isLoading() {
    return this._isLoading;
  }
}
