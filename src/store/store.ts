export type TokenData {
    accessToken: string;
    refreshToken?: string;
    expiry: Date;
}

export interface Store {
  checkToken(token?: string) : Promise<boolean> | boolean
  getToken(token: string) : Promise<TokenData | null> | TokenData | null
  persistToken(tokenData: TokenData, expiry: string) : Promise<void> | void
  deleteToken(token: string) : Promise<void> | void
  purgeExpired() : Promise<void> | void
}
