export class Follows {
  follower_handle: string;
  followee_handle: string;

  constructor(follower_handle: string, followee_handle: string) {
    this.follower_handle = follower_handle;
    this.followee_handle = followee_handle;
  }

  toString(): string {
    return (
      "Follows{" +
      "follower_handle='" +
      this.follower_handle +
      "'" +
      "followee_handle='" +
      this.followee_handle +
      "}"
    );
  }
}
