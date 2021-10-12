import { Store, TokenData } from "./store.ts";
import { SqliteDB } from "../../deps.ts";

export class SqliteStorage implements Store {
  private database: SqliteDB;

  constructor(file: string) {
    this.database = new SqliteDB(file);
    this.database.query(
      "CREATE TABLE IF NOT EXISTS tokens (token TEXT, expiry DATETIME)",
    );
  }
  checkToken(token?: string): boolean | Promise<boolean> {
    const res = this.database.query(
      "SELECT count(token) FROM tokens where token == (?) AND expiry > datetime('now')",
      [token],
    )[0][0] as number;
    console.log(res);
    return res == 1;
  }
  getToken(token: string): TokenData | Promise<TokenData | null> | null {
    const [dbtoken, dbexpiry] = this.database.query(
      "SELECT token,expiry FROM tokens where token == ?",
      [token],
    )[0][0] as [string, Date];
    return { accessToken: dbtoken, expiry: dbexpiry };
  }
  persistToken(tokenData: TokenData, expiry: string): void | Promise<void> {
    this.database.query(
      "INSERT INTO tokens (token,expiry) VALUES (?,datetime('now',?))",
      [tokenData.accessToken, expiry],
    );
  }
  deleteToken(token: string): void | Promise<void> {
    this.database.query("DELETE FROM tokens where token == ?", [token]);
  }
  purgeExpired(): void | Promise<void> {
    this.database.query("DELETE FROM tokens where expiry < datetime('now')");
  }

  public dumpTokens = () => {
    for (
      const [token, expiry] of this.database.query(
        "SELECT token,expiry FROM tokens",
      )
    ) {
      console.log(`TOKENDB ${token}, ${expiry}`);
    }
  };
}
