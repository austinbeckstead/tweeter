import { TweeterRequest } from "./TweeterRequest";

export interface RegisterUserRequest extends TweeterRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly alias: string;
  readonly password: string;
  readonly userImageBytes: string;
  readonly imageFileExtension: string;
}
