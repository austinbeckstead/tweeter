import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";
export interface LogoutUserView extends MessageView {
  clearUserInfo: () => void;
  navigateToLogin: () => void;
  authToken: AuthToken | null;
}
export class LogoutUserPresenter extends Presenter<LogoutUserView> {
  private _userService: UserService | null = null;
  public constructor(view: LogoutUserView) {
    super(view);
    this._userService = new UserService();
  }
  public get userService() {
    if (this._userService == null) {
      this._userService = new UserService();
    }
    return this._userService;
  }
  public async logOut() {
    this.view.displayInfoMessage("Logging Out...", 0);
    this.doFailureReportingOperation(async () => {
      await this.userService.logout(this.view.authToken!);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
      this.view.navigateToLogin();
    }, "log user out");
  }
}
