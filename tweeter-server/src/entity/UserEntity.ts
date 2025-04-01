export class UserEntity {
  first_name: string;
  last_name: string;
  alias: string;
  password: string;
  constructor(
    first_name: string,
    last_name: string,
    alias: string,
    password: string
  ) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.alias = alias;
    this.password = password;
  }

  toString(): string {
    return (
      "User{" +
      "auth_token='" +
      this.first_name +
      "'" +
      "last_name='" +
      this.last_name +
      "'" +
      "alias='" +
      this.alias +
      "'" +
      "password='" +
      this.password +
      "}"
    );
  }
}
