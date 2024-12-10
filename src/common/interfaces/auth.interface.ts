export interface JwtSign {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  id: number;
  deviceToken?: string;
  iat?: number;
  exp?: number;
}
