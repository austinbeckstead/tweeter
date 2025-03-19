import { AuthToken } from "../../domain/AuthToken";
import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface LoginUserResponse extends TweeterResponse {
  readonly user: UserDto;
  readonly token: AuthToken;
}
