import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { View, Presenter } from "./Presenter";
export interface NavigateUserView extends View {
  setDisplayedUser: (user: User) => void;
}
export class NavigateUserPresenter extends Presenter<NavigateUserView> {
  private userService: UserService;
  public constructor(view: NavigateUserView) {
    super(view);
    this.userService = new UserService();
  }
  public async navigateToUser(
    alias: string,
    currentUser: User | null,
    authToken: AuthToken | null
  ) {
    this.doFailureReportingOperation(async () => {
      const user = await this.userService.getUser(authToken!, alias);
      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    }, "get user");
  }
}
