import { UserService } from "../model/service/UserService";
import { UserPresenter, UserView } from "./UserPresenter";

export class LoginUserPresenter extends UserPresenter {
  private userService: UserService;
  public constructor(view: UserView, originalUrl?: string) {
    super(view, originalUrl);
    this.userService = new UserService();
  }

  public async doLogin(alias: string, password: string) {
    this.doFailureReportingOperation(async () => {
      this.isLoading = true;
      const [user, authToken] = await this.userService.login(alias, password);
      this.view.updateUserInfo(user, user, authToken, this.rememberMe);

      if (!!this.originalUrl) {
        this.view.navigate(this.originalUrl);
      } else {
        this.view.navigate("/");
      }
    }, "log user in");
    this.isLoading = false;
  }
}
