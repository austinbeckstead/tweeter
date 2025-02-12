import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { UserPresenter, UserView } from "./UserPresenter";
export interface NavigateUserView {
  setDisplayedUser: (user: User) => void;
  displayErrorMessage: (message: string) => void;
}
export class NavigateUserPresenter {
  private userService: UserService;
  private view: NavigateUserView;
  public constructor(view: NavigateUserView) {
    this.view = view;
    this.userService = new UserService();
  }
  public async navigateToUser(
    alias: string,
    currentUser: User | null,
    authToken: AuthToken | null
  ) {
    try {
      const user = await this.userService.getUser(authToken!, alias);
      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  }
}
