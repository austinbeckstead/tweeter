import { User, AuthToken } from "tweeter-shared";

export interface UserView {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: (originalUrl: string) => void;
  displayErrorMessage: (message: string) => void;
}
export abstract class UserPresenter {
  private _view: UserView;
  private _rememberMe = false;
  private _isLoading = false;
  private _originalUrl: string | void;

  protected constructor(view: UserView, originalUrl?: string) {
    this._view = view;
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
  protected get rememberMe() {
    return this._rememberMe;
  }
  protected get view() {
    return this._view;
  }
  protected get originalUrl() {
    return this._originalUrl;
  }
}
