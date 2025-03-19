import { TweeterRequest } from "./TweeterRequest";

export interface GetIsFollowerStatusRequest extends TweeterRequest {
  readonly token: string;
  readonly userAlias: string;
  readonly selectedUserAlias: string;
}
