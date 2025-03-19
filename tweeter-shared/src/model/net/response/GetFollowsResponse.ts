import { TweeterResponse } from "./TweeterResponse";

export interface GetFollowsResponse extends TweeterResponse {
  readonly followsCount: number;
}
