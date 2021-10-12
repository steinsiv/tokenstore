import { Store, TokenData } from "./store.ts";
import { SqliteDB } from "../../deps.ts";

export default class SqliteStore implements Store {
  private database: SqliteDB;

  constructor(file: string) {
    this.database = new SqliteDB(file);
    this.database.query(
      "CREATE TABLE IF NOT EXISTS tokens (token TEXT, tokenData TEXT, expiry DATE)",
    );
  }

  checkToken = (token?: string): TokenData | Promise<TokenData> => {
    this.purgeExpired();
    const res = this.database.query(
      "SELECT token FROM tokens where token == (?) AND expiry > datetime('now')",
      [token],
    )[0][0] as string;
    return res ? JSON.parse(res) as TokenData : { active: "false" };
  };

  storeToken = (
    token: string,
    tokenData: TokenData,
    expiry: Date,
  ): void | Promise<void> => {
    this.database.query(
      "INSERT INTO tokens (token,tokenData, expiry) VALUES (?,?, datetime('now',?))",
      [token, JSON.stringify(tokenData), expiry],
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
