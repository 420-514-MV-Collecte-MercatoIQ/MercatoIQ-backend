import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DeletePlayerResultDto } from '../common/dto/paginated-response.dto';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerQueryDto } from './dto/player-query.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayersService } from './players.service';

@ApiTags('Players')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Jeton JWT manquant ou invalide' })
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  @ApiOperation({
    summary: 'Liste paginée et filtrée des joueurs',
    description:
      'Retourne les profils Silver triés par valeur marchande décroissante avec filtres dynamiques.',
  })
  @ApiResponse({ status: 200, description: 'Liste paginée des joueurs et métadonnées' })
  @ApiBadRequestResponse({ description: 'Paramètres de requête invalides' })
  findAll(@Query() query: PlayerQueryDto) {
    return this.playersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupère un joueur par son player_id' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 342229,
    description: 'Identifiant unique Transfermarkt du joueur',
  })
  @ApiResponse({ status: 200, description: 'Détails du joueur' })
  @ApiBadRequestResponse({ description: 'Identifiant numérique invalide' })
  @ApiNotFoundResponse({ description: 'Joueur introuvable' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crée un nouveau joueur (Silver)' })
  @ApiResponse({ status: 201, description: 'Joueur créé avec succès' })
  @ApiBadRequestResponse({ description: 'Données du joueur invalides' })
  @ApiConflictResponse({ description: 'Un joueur avec ce player_id existe déjà' })
  create(@Body() dto: CreatePlayerDto) {
    return this.playersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Met à jour partiellement un joueur existant' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 342229,
    description: 'Identifiant unique Transfermarkt du joueur',
  })
  @ApiResponse({ status: 200, description: 'Joueur mis à jour' })
  @ApiBadRequestResponse({ description: 'Données de mise à jour invalides' })
  @ApiNotFoundResponse({ description: 'Joueur introuvable' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePlayerDto) {
    return this.playersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprime un joueur par son player_id' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 342229,
    description: 'Identifiant unique Transfermarkt du joueur',
  })
  @ApiResponse({
    status: 200,
    description: 'Joueur supprimé',
    type: DeletePlayerResultDto,
  })
  @ApiNotFoundResponse({ description: 'Joueur introuvable' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.remove(id);
  }
}
