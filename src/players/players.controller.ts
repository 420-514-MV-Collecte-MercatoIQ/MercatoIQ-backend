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
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  DeletePlayerResultDto,
  ErrorResponseDto,
  PaginatedPlayersResponseDto,
} from '../common/dto/paginated-response.dto';
import { SilverPlayer } from '../database/schemas/silver/silver-player.schema';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerQueryDto } from './dto/player-query.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayersService } from './players.service';

@ApiTags('Players')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Jeton JWT manquant ou invalide',
  type: ErrorResponseDto,
})
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  @ApiOperation({
    summary: 'Liste paginée et filtrée des joueurs',
    description:
      'Retourne les profils Silver triés par valeur marchande décroissante avec filtres dynamiques.',
  })
  @ApiOkResponse({
    description: 'Liste paginée des joueurs et métadonnées',
    type: PaginatedPlayersResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Paramètres de requête invalides',
    type: ErrorResponseDto,
  })
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
  @ApiOkResponse({
    description: 'Détails du joueur',
    type: SilverPlayer,
  })
  @ApiBadRequestResponse({
    description: 'Identifiant numérique invalide',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Joueur introuvable',
    type: ErrorResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crée un nouveau joueur (Silver)' })
  @ApiCreatedResponse({
    description: 'Joueur créé avec succès',
    type: SilverPlayer,
  })
  @ApiBadRequestResponse({
    description: 'Données du joueur invalides',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Un joueur avec ce player_id existe déjà',
    type: ErrorResponseDto,
  })
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
  @ApiOkResponse({
    description: 'Joueur mis à jour',
    type: SilverPlayer,
  })
  @ApiBadRequestResponse({
    description: 'Données de mise à jour invalides',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Joueur introuvable',
    type: ErrorResponseDto,
  })
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
  @ApiOkResponse({
    description: 'Joueur supprimé',
    type: DeletePlayerResultDto,
  })
  @ApiBadRequestResponse({
    description: 'Identifiant numérique invalide',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Joueur introuvable',
    type: ErrorResponseDto,
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.remove(id);
  }
}
