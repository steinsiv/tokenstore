import { Store, TokenData } from "./store.ts";
import { Redis, RedisConnect } from "../../deps.ts";

export default class RedisStore implements Store {
  private database: Redis | undefined;
  private host: string;
  private port: number;
  private prefix: string;

  constructor(host: string, port: number, prefix: string = "token_") {
    this.host = host;
    this.port = port;
    this.prefix = prefix;
  }

  private connect = async () => {
    if (!this.database) {
      this.database = await RedisConnect({ hostname: this.host, port: this.port });
    }
  };

  checkToken = async (token?: string): Promise<TokenData> => {
    this.connect();
    const dbtoken = await this.database?.get(`${this.prefix}${token}`);
    return dbtoken ? JSON.parse(dbtoken) : { active: "false" };
  };

  storeToken = async (
    token: string,
    tokenData: TokenData,
  ): Promise<void> => {
    this.connect();
    await this.database?.set(
      `${this.prefix}${token}`,
      JSON.stringify(tokenData),
    );
    const expiry = new Date(tokenData.exp as number);
    const timestamp = String(expiry.getTime() / 1000);
    await this.database?.expireat(`${this.prefix}${token}`, timestamp);
  };

  revokeToken = async (token: string) => {
    this.connect();
    await this.database?.del(`${this.prefix}${token}`);
  };

  purgeExpired = (): void | Promise<void> => {
    //@todo no need in redis with TTL
  };
  public dump = () => {
  };
}
