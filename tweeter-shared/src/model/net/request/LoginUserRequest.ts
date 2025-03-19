import { TweeterRequest } from "./TweeterRequest";

export interface LoginUserRequest extends TweeterRequest {
  readonly alias: string;
  readonly password: string;
}
