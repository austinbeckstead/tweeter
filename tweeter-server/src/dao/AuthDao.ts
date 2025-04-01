import { Auth } from "../entity/Auth";

export interface AuthDao {
  addAuth(auth: Auth): Promise<void>;
  deleteAuth(token: string): Promise<void>;
  getAuth(token: string): Promise<Auth | undefined>;
  getAliasFromAuth(token: string): Promise<string | undefined>;
}
