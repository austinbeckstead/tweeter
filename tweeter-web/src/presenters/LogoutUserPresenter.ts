import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { UserPresenter, UserView } from "./UserPresenter";
export interface LogoutUserView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
  clearUserInfo: () => void;
  authToken: AuthToken | null;
}
export class LogoutUserPresenter {
  view: LogoutUserView;
  private userService: UserService;
  public constructor(view: LogoutUserView) {
    this.view = view;
    this.userService = new UserService();
  }
  public async logOut() {
    this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.userService.logout(this.view.authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }
}
