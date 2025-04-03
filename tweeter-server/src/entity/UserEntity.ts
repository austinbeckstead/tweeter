export class UserEntity {
  first_name: string;
  last_name: string;
  alias: string;
  password: string;
  image_url: string;
  constructor(
    first_name: string,
    last_name: string,
    alias: string,
    password: string,
    image_url: string
  ) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.alias = alias;
    this.password = password;
    this.image_url = image_url;
  }
}
