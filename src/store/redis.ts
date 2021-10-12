import { Store, TokenData } from "./store.ts";

export default class RedisStore implements Store {
  checkToken(token?: string): TokenData | Promise<TokenData> {
    throw new Error("Method not implemented.");
  }
  storeToken(token: string, tokenData: TokenData, expiry: Date): void | Promise<void> {
    throw new Error("Method not implemented.");
  }
  revokeToken(token: string): void | Promise<void> {
    throw new Error("Method not implemented.");
  }
  purgeExpired(): void | Promise<void> {
    throw new Error("Method not implemented.");
  }
}
