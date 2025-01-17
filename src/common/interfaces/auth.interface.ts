export interface JwtSign {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  id: number;
  deviceToken?: string;
  storeId?: number;
  iat?: number;
  exp?: number;
  type?: string;
}
