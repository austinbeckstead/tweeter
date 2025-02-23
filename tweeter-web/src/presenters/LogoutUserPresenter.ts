import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";
import { UserPresenter, UserView } from "./UserPresenter";
export interface LogoutUserView extends MessageView {
  clearUserInfo: () => void;
  authToken: AuthToken | null;
}
export class LogoutUserPresenter extends Presenter<LogoutUserView> {
  private userService: UserService;
  public constructor(view: LogoutUserView) {
    super(view);
    this.userService = new UserService();
  }
  public async logOut() {
    this.view.displayInfoMessage("Logging Out...", 0);
    this.doFailureReportingOperation(async () => {
      await this.userService.logout(this.view.authToken!);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  }
}
