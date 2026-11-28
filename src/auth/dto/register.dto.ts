import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({
    example: "analyst@mercatoiq.io",
    description: "Adresse courriel unique de l’utilisateur",
    format: "email",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "StrongPass2026!",
    description: "Mot de passe (entre 8 et 72 caractères)",
    minLength: 8,
    maxLength: 72,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
