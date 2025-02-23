import { User, AuthToken } from "tweeter-shared";
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

  protected constructor(view: UserView, originalUrl?: string) {
    super(view);
    this._originalUrl = originalUrl;
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
