import { ERoleType } from '../enums';

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
  type: ERoleType;
}

export interface IAdmin {
  id: number;
  isRoot: boolean;
}
