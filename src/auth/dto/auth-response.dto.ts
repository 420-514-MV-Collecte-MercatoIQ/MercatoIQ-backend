import { ApiProperty } from "@nestjs/swagger";
import { USER_ROLES, UserRole } from "../../users/constants/user-roles.constant";

export class AuthUserDto {
  @ApiProperty({
    example: "67461d90f8c1e2a4b9012345",
    description: "Identifiant MongoDB de l’utilisateur",
  })
  id: string;

  @ApiProperty({
    example: "analyst@mercatoiq.io",
    description: "Adresse courriel de l’utilisateur",
  })
  email: string;

  @ApiProperty({
    enum: USER_ROLES,
    example: "user",
    description: "Rôle RBAC attribué à l’utilisateur",
  })
  role: UserRole;
}

export class AuthResponseDto {
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "Jeton JWT Bearer à inclure dans l’en-tête Authorization",
  })
  access_token: string;

  @ApiProperty({
    type: AuthUserDto,
    description: "Profil de l’utilisateur authentifié",
  })
  user: AuthUserDto;
}
