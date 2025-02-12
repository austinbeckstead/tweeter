import { UserService } from "../model/service/UserService";
import { UserPresenter, UserView } from "./UserPresenter";

export class LoginUserPresenter extends UserPresenter {
  private userService: UserService;
  public constructor(view: UserView, originalUrl?: string) {
    super(view, originalUrl);
    this.userService = new UserService();
  }
  public async doLogin(alias: string, password: string) {
    try {
      this.isLoading = true;
      const [user, authToken] = await this.userService.login(alias, password);
      this.view.updateUserInfo(user, user, authToken, this.rememberMe);

      if (!!this.originalUrl) {
        this.view.navigate(this.originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this.isLoading = false;
    }
  }
}
