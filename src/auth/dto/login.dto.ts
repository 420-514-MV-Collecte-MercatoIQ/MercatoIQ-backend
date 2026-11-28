import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength } from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: "analyst@mercatoiq.io",
    description: "Adresse courriel de l’utilisateur",
    format: "email",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "StrongPass2026!",
    description: "Mot de passe du compte (max 72 caractères)",
    maxLength: 72,
  })
  @IsString()
  @MaxLength(72)
  password: string;
}
