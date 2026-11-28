import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { ClubsService } from "./clubs.service";
import { ClubQueryDto } from "./dto/club-query.dto";

@ApiTags("Clubs & Competitions")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Jeton absent ou invalide" })
@Controller()
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Get("competitions")
  @ApiOperation({ summary: "Liste les 6 compétitions du projet" })
  @ApiOkResponse({ description: "Liste des compétitions" })
  findCompetitions() {
    return this.clubsService.findCompetitions();
  }

  @Get("clubs")
  @ApiOperation({ summary: "Liste paginée et filtrée des clubs" })
  @ApiOkResponse({ description: "Liste des clubs" })
  @ApiBadRequestResponse({ description: "Paramètres invalides" })
  findClubs(@Query() query: ClubQueryDto) {
    return this.clubsService.findClubs(query);
  }

  @Get("clubs/:id")
  @ApiOperation({ summary: "Récupère un club par son club_id" })
  @ApiOkResponse({ description: "Détails du club" })
  @ApiBadRequestResponse({ description: "Identifiant non numérique" })
  @ApiNotFoundResponse({ description: "Club introuvable" })
  findClub(@Param("id", ParseIntPipe) id: number) {
    return this.clubsService.findClub(id);
  }
}
