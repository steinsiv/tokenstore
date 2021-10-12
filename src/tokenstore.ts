import { Store, TokenData } from "./store/store.ts";

export class TokenStore {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  public check = async (token: string) => {
    await this.store.revokeToken(token);
  };
  public revoke = async (token: string) => {
    await this.store.revokeToken(token);
  };
  public insert = async (token: string, tokenData: TokenData, expiry: Date) => {
    await this.store.storeToken(token, tokenData, expiry);
  };
  public dump = () => {
    this.store.dump();
  };
}
