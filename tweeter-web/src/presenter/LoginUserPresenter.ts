import { UserPresenter } from "./UserPresenter";

export class LoginUserPresenter extends UserPresenter {
  public async loginUser(alias: string, password: string) {
    await this.authenticateUser(
      alias,
      password,
      async (alias: string, password: string) => {
        return this.service.login(alias, password);
      },
      () => {
        return "log user in";
      },
      () => {
        if (!!this.originalUrl) {
          this.view.navigate(this.originalUrl);
        } else {
          this.view.navigate("/");
        }
      }
    );
  }
  //For abstraction implementation
  /*
  protected async authenticate(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    console.log("AA");

  }
  protected getMessageString(): string {
    return "log user in";
  }
  protected navigate(): void {
    if (!!this.originalUrl) {
      this.view.navigate(this.originalUrl);
    } else {
      this.view.navigate("/");
    }
  }
  */
}
