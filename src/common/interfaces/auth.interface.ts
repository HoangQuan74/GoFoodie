export interface JwtSign {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  id: number;
  iat?: number;
  exp?: number;
}
