export class Auth {
  auth_token: string;
  alias: string;
  timestamp: number;
  constructor(auth_token: string, alias: string, timestamp: number) {
    this.auth_token = auth_token;
    this.alias = alias;
    this.timestamp = timestamp;
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
