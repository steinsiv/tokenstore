import { Store, TokenData } from "./store.ts";
import { SqliteDB } from "../../deps.ts";

export default class SqliteStore implements Store {
  private database: SqliteDB;

  constructor(file: string) {
    this.database = new SqliteDB(file);
    this.database.query(
      "CREATE TABLE IF NOT EXISTS tokens (token TEXT, tokenData TEXT, expiry DATETIME)",
    );
  }

  checkToken = (token?: string): TokenData | Promise<TokenData> => {
    this.purgeExpired();
    const res = this.database.query(
      "SELECT tokenData FROM tokens where token == (?) AND expiry > datetime('now')",
      [token],
    )[0];
    return res ? JSON.parse(res[0] as string) as TokenData : { active: false, exp: 0 };
  };

  storeToken = (
    token: string,
    tokenData: TokenData,
  ): void | Promise<void> => {
    this.database.query(
      "INSERT INTO tokens (token,tokenData, expiry) VALUES (?,?,datetime(?,'unixepoch'))",
      [token, JSON.stringify(tokenData), tokenData.exp / 1000],
    );
  };

  revokeToken = (token: string): void | Promise<void> => {
    this.database.query("DELETE FROM tokens where token == ?", [token]);
  };

  purgeExpired = (): void | Promise<void> => {
    this.database.query("DELETE FROM tokens where expiry < datetime('now')");
  };

  public dump = () => {
    for (
      const [token, expiry] of this.database.query(
        "SELECT token,expiry FROM tokens",
      )
    ) {
      console.log(`TOKENDB ${token}, ${expiry}`);
    }
  };
}
