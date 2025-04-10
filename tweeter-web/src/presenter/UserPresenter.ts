import { User, AuthToken } from "tweeter-shared";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserView extends View {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: (originalUrl: string) => void;
}
export abstract class UserPresenter extends Presenter<UserView> {
  private _rememberMe = false;
  private _isLoading = false;
  private _originalUrl: string | void;
  private _service: UserService;
  public constructor(view: UserView, originalUrl?: string) {
    super(view);
    this._originalUrl = originalUrl;
    this._service = new UserService();
  }
  //Alternative (better?) authenticate user using abstraction
  /*public async authenticateUser(alias: string, password: string) {
    this.doFailureReportingOperation(async () => {
      this.isLoading = true;
      const [user, authToken] = await this.authenticate(alias, password);
      this.view.updateUserInfo(user, user, authToken, this.rememberMe);
      this.navigate();
    }, this.getMessageString());
    this.isLoading = false;
  }
  protected abstract authenticate(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]>;
  protected abstract getMessageString(): string;
  protected abstract navigate(): void;
*/

  public async authenticateUser(
    alias: string,
    password: string,
    authenticate: (
      alias: string,
      password: string
    ) => Promise<[User, AuthToken]>,
    getMessageString: () => string,
    navigate: () => void
  ) {
    await this.doFailureReportingOperation(async () => {
      try {
        this.isLoading = true;
        const [user, authToken] = await authenticate(alias, password);
        this.view.updateUserInfo(user, user, authToken, this.rememberMe);
        collapseTextChangeRangesAcrossMultipleVersions;
        navigate();
      } finally {
        this.isLoading = false;
      }
    }, getMessageString());
  }

  protected get service(): UserService {
    return this._service;
  }
  public get isLoading() {
    return this._isLoading;
  }
  protected set isLoading(value: boolean) {
    this._isLoading = value;
  }
  public setRememberMe(rememberMe: boolean) {
    this._rememberMe = rememberMe;
  }
  public get rememberMe() {
    return this._rememberMe;
  }
  protected get originalUrl() {
    return this._originalUrl;
  }
}
