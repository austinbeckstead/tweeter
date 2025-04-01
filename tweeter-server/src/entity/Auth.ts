export class Auth {
  auth_token: string;
  alias: string;
  constructor(auth_token: string, alias: string) {
    this.auth_token = auth_token;
    this.alias = alias;
  }

  toString(): string {
    return (
      "Auth{" +
      "auth_token='" +
      this.auth_token +
      "'" +
      "alias='" +
      this.alias +
      "}"
    );
  }
}
