import { Store } from "./store.ts";
import type { TokenData } from "./store.ts";

//Use accesstoken as key
export default class MemoryStore implements Store {
  data: Map<string, TokenData>;

  constructor() {
    this.data = new Map();
  }
  checkToken(token: string) {
    //@todo check datestatmp
    return this.data.has(token);
  }
  getToken(token: string) {
    return this.data.has(token) ? this.data.get(token)! : null;
  }
  persistToken(tokenData: TokenData, expiry: string) {
    this.data.set(tokenData.accessToken, tokenData);
  }
  deleteToken(token: string) {
    this.data.delete(token);
  }
  purgeExpired() {
    //
  }
}
