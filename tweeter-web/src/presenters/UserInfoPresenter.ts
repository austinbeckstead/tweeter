import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserInfoView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
  authToken: AuthToken | null;
}
export class UserInfoPresenter {
  private _isLoading = false;
  private _followeeCount = -1;
  private _followerCount = -1;
  private view: UserInfoView;
  private _isFollower = false;
  private userService = new UserService();
  public constructor(view: UserInfoView) {
    this.view = view;
  }
  public async setIsFollowerStatus(currentUser: User, displayedUser: User) {
    try {
      if (currentUser === displayedUser) {
        this._isFollower = false;
      } else {
        this._isFollower = await this.userService.getIsFollowerStatus(
          this.view.authToken!,
          currentUser!,
          displayedUser!
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }
  public async setNumbFollowees(displayedUser: User) {
    try {
      this._followeeCount = await this.userService.getFolloweeCount(
        this.view.authToken!,
        displayedUser
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  }
  public async setNumbFollowers(displayedUser: User) {
    try {
      this._followerCount = await this.userService.getFollowerCount(
        this.view.authToken!,
        displayedUser
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  }

  public async followDisplayedUser(displayedUser: User | null): Promise<void> {
    try {
      this._isLoading = true;
      this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.userService.follow(
        this.view.authToken!,
        displayedUser!
      );

      this._isFollower = true;
      this._followerCount = followerCount;
      this._followeeCount = followeeCount;
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this._isLoading = false;
    }
  }
  public async unfollowDisplayedUser(
    displayedUser: User | null
  ): Promise<void> {
    try {
      this._isLoading = true;
      this.view.displayInfoMessage(`Unfollowing ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.userService.unfollow(
        this.view.authToken!,
        displayedUser!
      );

      this._isFollower = false;
      this._followerCount = followerCount;
      this._followeeCount = followeeCount;
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this._isLoading = false;
    }
  }
  public get isLoading() {
    return this._isLoading;
  }
  public get followeeCount() {
    return this._followeeCount;
  }
  public get followerCount() {
    return this._followerCount;
  }
  public get isFollower() {
    return this._isFollower;
  }
}
