// https://datatracker.ietf.org/doc/html/rfc7662#section-2.2
export type TokenData = {
  active: boolean;
  scope?: string; // https://datatracker.ietf.org/doc/html/rfc6749#section-3.3
  "client_id"?: string;
  username?: string;
  "token_type"?: string;
  exp: number;
  iat?: number;
  nbf?: number;
  sub?: string;
  aud?: string;
  iss?: string;
  jti?: string;
};

export interface Store {
  checkToken(token?: string): Promise<TokenData> | TokenData;
  storeToken(
    token: string,
    tokenData: TokenData,
  ): Promise<void> | void;
  revokeToken(token: string): Promise<void> | void;
  purgeExpired(): Promise<void> | void;
  dump(): Promise<void> | void;
}
