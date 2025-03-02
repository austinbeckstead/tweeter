import {
  LogoutUserPresenter,
  LogoutUserView,
} from "../../src/presenter/LogoutUserPresenter";
import {
  mock,
  instance,
  verify,
  spy,
  when,
  anything,
  capture,
} from "ts-mockito";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../src/model/service/UserService";

describe("NavigateUserPresenter", () => {
  let mockLogoutUserView: LogoutUserView;
  let logoutUserPresenter: LogoutUserPresenter;
  let mockUserService: UserService;
  const authToken = new AuthToken("abc123", Date.now());
  beforeEach(() => {
    mockLogoutUserView = mock<LogoutUserView>();
    const mockLogoutUserViewInstance = instance(mockLogoutUserView);
    mockLogoutUserViewInstance.authToken = authToken;
    const logoutUserPresenterSpy = spy(
      new LogoutUserPresenter(mockLogoutUserViewInstance)
    );
    logoutUserPresenter = instance(logoutUserPresenterSpy);
    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);
    when(logoutUserPresenterSpy.userService).thenReturn(
      mockUserServiceInstance
    );
  });
  it("tells the view to display a logging out message", async () => {
    await logoutUserPresenter.logOut();
    verify(mockLogoutUserView.displayInfoMessage("Logging Out...", 0)).once();
  });
  it("calls logout on the user service with the correct AuthToken", async () => {
    await logoutUserPresenter.logOut();
    verify(mockUserService.logout(anything())).once();
    /*let [capturedAuthToken] = capture(mockUserService.logout).last();
    expect(capturedAuthToken).toEqual(authToken);*/
  });
  it("tells the view to clear the last info message, clear the user info, and navigate to the login page", async () => {
    await logoutUserPresenter.logOut();
    verify(mockLogoutUserView.clearLastInfoMessage()).once();
    verify(mockLogoutUserView.clearUserInfo()).once();
    verify(mockLogoutUserView.navigateToLogin()).once();
    verify(mockLogoutUserView.displayErrorMessage(anything())).never();
  });
  it("displays an error message and does not clear the last info message, clear the user info, and navigate to the login page when logout fails", async () => {
    const error = new Error("An error occurred");
    when(mockUserService.logout(authToken)).thenThrow(error);
    await logoutUserPresenter.logOut();
    verify(
      mockLogoutUserView.displayErrorMessage(
        `Failed to log user out because of exception: An error occurred`
      )
    ).once();
    verify(mockLogoutUserView.clearLastInfoMessage()).never();
    verify(mockLogoutUserView.clearUserInfo()).never();
    verify(mockLogoutUserView.navigateToLogin()).never();
  });
});
