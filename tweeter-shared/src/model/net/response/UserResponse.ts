import { AuthToken } from "../../domain/AuthToken";
import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface UserResponse extends TweeterResponse {
  readonly user: UserDto | null;
  readonly token: AuthToken | null;
}
