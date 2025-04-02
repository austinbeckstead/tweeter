import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { View, Presenter, MessageView } from "./Presenter";

export interface UserInfoView extends MessageView {
  authToken: AuthToken | null;
}
export class UserInfoPresenter extends Presenter<UserInfoView> {
  private _isLoading = false;
  private _followeeCount = -1;
  private _followerCount = -1;
  private _isFollower = false;
  private userService = new UserService();
  public constructor(view: UserInfoView) {
    super(view);
  }
  public async setIsFollowerStatus(currentUser: User, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this._isFollower = false;
      } else {
        this._isFollower = await this.userService.getIsFollowerStatus(
          this.view.authToken!,
          currentUser!,
          displayedUser!
        );
      }
      console.log("IS FOLLOWER PRESENTER:");
      console.log(this._isFollower);
    }, "determine follwer status");
  }
  public async setNumbFollowees(displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this._followeeCount = await this.userService.getFolloweeCount(
        this.view.authToken!,
        displayedUser
      );
    }, "get followees count");
  }
  public async setNumbFollowers(displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this._followerCount = await this.userService.getFollowerCount(
        this.view.authToken!,
        displayedUser
      );
    }, "get followers count");
  }

  public async followDisplayedUser(displayedUser: User | null): Promise<void> {
    this.doFailureReportingOperation(async () => {
      this._isLoading = true;
      this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.userService.follow(
        this.view.authToken!,
        displayedUser!
      );

      this._isFollower = true;
      this._followerCount = followerCount;
      this._followeeCount = followeeCount;
    }, "follow user");
    this.view.clearLastInfoMessage();
    this._isLoading = false;
  }

  public async unfollowDisplayedUser(
    displayedUser: User | null
  ): Promise<void> {
    this.doFailureReportingOperation(async () => {
      this._isLoading = true;
      this.view.displayInfoMessage(`Unfollowing ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.userService.unfollow(
        this.view.authToken!,
        displayedUser!
      );

      this._isFollower = false;
      this._followerCount = followerCount;
      this._followeeCount = followeeCount;
    }, "unfollow user");
    this.view.clearLastInfoMessage();
    this._isLoading = false;
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
