import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  @ApiOperation({
    summary: "Créer un nouveau compte utilisateur",
    description:
      "Enregistre un utilisateur avec le rôle par défaut `user`, hache le mot de passe via bcrypt et retourne un jeton JWT.",
  })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    description: "Compte créé et jeton JWT émis",
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({ description: "Données d’inscription invalides" })
  @ApiConflictResponse({ description: "Adresse courriel déjà utilisée" })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Authentifier un utilisateur existant",
    description:
      "Vérifie les identifiants (email / mot de passe) et retourne un jeton JWT Bearer pour accéder aux routes protégées.",
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: "Authentification réussie",
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({ description: "Requête malformée" })
  @ApiUnauthorizedResponse({ description: "Identifiants invalides" })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
