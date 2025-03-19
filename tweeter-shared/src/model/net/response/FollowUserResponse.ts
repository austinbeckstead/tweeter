import { TweeterResponse } from "./TweeterResponse";

export interface FollowUserResponse extends TweeterResponse {
  readonly followerCount: number;
  readonly followeeCount: number;
}
