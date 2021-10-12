import { Store } from "./store.ts";
import type { TokenData } from "./store.ts";

//Use accesstoken as key
export default class MemoryStore implements Store {
  data: Map<string, TokenData>;

  constructor() {
    this.data = new Map();
  }
  storeToken(token: string, tokenData: TokenData): void | Promise<void> {
    this.data.set(token, tokenData);
  }
  revokeToken(token: string): void | Promise<void> {
    this.data.delete(token);
  }
  checkToken(token: string): TokenData | Promise<TokenData> {
    const inStore = this.data.get(token);
    return inStore ? inStore : { active: "false" };
  }
  purgeExpired() {
    //@todo remove all expired by timestamp   exp?: number;
  }
}
