import { Auth } from "../entity/Auth";

export interface AuthDao {
  addAuth(auth: Auth): Promise<void>;
  deleteAuth(auth: Auth): Promise<void>;
  getAuth(auth: Auth): Promise<Auth | undefined>;
  getAliasFromAuth(auth: Auth): Promise<string | undefined>;
}
