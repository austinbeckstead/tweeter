import { TweeterRequest } from "./TweeterRequest";

export interface FollowUserRequest extends TweeterRequest {
  readonly token: string;
  readonly alias: string;
  readonly selectedAlias: string;
}
