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
    let inStore: TokenData = this.data.get(token) || { active: false, exp: 0 };
    if (inStore.exp) {
      const exp = new Date(inStore.exp as number);
      if (exp < new Date()) {
        inStore = { active: false, exp: exp.getTime() };
      }
    } else {
      this.purgeExpired();
    }
    return inStore;
  }
  purgeExpired() {
    for (const [key, value] of this.data) {
      if (value.exp && new Date(value.exp as number) < new Date()) {
        this.revokeToken(key);
      }
    }
  }
  dump() {
    console.log(`Num tokens in memory: ${this.data.size}`);
    for (const [key, value] of this.data) {
      console.log(key, value);
    }
  }
}
