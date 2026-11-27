import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ClubsService } from "./clubs.service";
import { ClubQueryDto } from "./dto/club-query.dto";

@ApiTags("Clubs & Competitions")
@ApiBearerAuth()
@Controller()
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Get("competitions")
  @ApiOperation({ summary: "Liste les 6 compétitions du projet" })
  @ApiResponse({ status: 200, description: "Liste des compétitions" })
  findCompetitions() {
    return this.clubsService.findCompetitions();
  }

  @Get("clubs")
  @ApiOperation({ summary: "Liste paginée et filtrée des clubs" })
  @ApiResponse({ status: 200, description: "Liste des clubs" })
  @ApiResponse({ status: 400, description: "Paramètres invalides" })
  findClubs(@Query() query: ClubQueryDto) {
    return this.clubsService.findClubs(query);
  }

  @Get("clubs/:id")
  @ApiOperation({ summary: "Récupère un club par son club_id" })
  @ApiResponse({ status: 200, description: "Détails du club" })
  @ApiResponse({ status: 404, description: "Club introuvable" })
  findClub(@Param("id", ParseIntPipe) id: number) {
    return this.clubsService.findClub(id);
  }
}
