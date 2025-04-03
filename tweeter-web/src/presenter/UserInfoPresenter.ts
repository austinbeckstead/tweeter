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
  public async setIsFollowerStatus(
    currentUser: User,
    displayedUser: User
  ): Promise<boolean> {
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
    }, "determine follwer status");
    return this._isFollower;
  }
  public async setNumbFollowees(displayedUser: User): Promise<number> {
    return this.doFailureReportingOperation(async () => {
      this._followeeCount = await this.userService.getFolloweeCount(
        this.view.authToken!,
        displayedUser
      );
      return this._followeeCount;
    }, "get followees count");
  }
  public async setNumbFollowers(displayedUser: User): Promise<number> {
    return this.doFailureReportingOperation(async () => {
      this._followerCount = await this.userService.getFollowerCount(
        this.view.authToken!,
        displayedUser
      );
      return this._followerCount;
    }, "get followers count");
  }

  public async followDisplayedUser(
    displayedUser: User | null
  ): Promise<[boolean, number, number]> {
    try {
      return await this.doFailureReportingOperation(async () => {
        this._isLoading = true;
        this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);
        this._isFollower = true;
        [this._followerCount, this._followeeCount] =
          await this.userService.follow(this.view.authToken!, displayedUser!);
        return [this._isFollower, this._followeeCount, this._followerCount];
      }, "follow user");
    } finally {
      this._isLoading = false;
      this.view.clearLastInfoMessage();
    }
  }

  public async unfollowDisplayedUser(
    displayedUser: User | null
  ): Promise<[boolean, number, number]> {
    try {
      return this.doFailureReportingOperation(async () => {
        this._isLoading = true;
        this.view.displayInfoMessage(
          `Unfollowing ${displayedUser!.name}...`,
          0
        );
        this._isFollower = false;
        [this._followerCount, this._followeeCount] =
          await this.userService.unfollow(this.view.authToken!, displayedUser!);
        return [this._isFollower, this._followeeCount, this._followerCount];
      }, "unfollow user");
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
