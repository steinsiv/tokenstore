import { Store, TokenData } from "./store/store.ts";

export class TokenStorage {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  public revokeToken() {}
  public insertToken() {}
  public checkToken() {}
  public refreshToken() {}
}
