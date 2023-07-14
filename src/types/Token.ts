import { UserRole } from "./User";

export interface AccessTokenPayload {
  email: string;
  id: string;
  role: UserRole;
}

export interface RefreshTokenPayload extends AccessTokenPayload {
  refreshTokenId: string;
}
