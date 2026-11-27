import { UserRole } from "../users/constants/user-roles.constant";

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
}
