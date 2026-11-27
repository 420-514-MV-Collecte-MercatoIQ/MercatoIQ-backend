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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerQueryDto } from './dto/player-query.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayersService } from './players.service';

@ApiTags('Players')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  @ApiOperation({ summary: 'Liste paginée et filtrée des joueurs' })
  @ApiResponse({ status: 200, description: 'Liste des joueurs' })
  findAll(@Query() query: PlayerQueryDto) {
    return this.playersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupère un joueur par son player_id' })
  @ApiResponse({ status: 200, description: 'Détails du joueur' })
  @ApiResponse({ status: 404, description: 'Joueur introuvable' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crée un nouveau joueur' })
  @ApiResponse({ status: 201, description: 'Joueur créé' })
  create(@Body() dto: CreatePlayerDto) {
    return this.playersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Met à jour un joueur existant' })
  @ApiResponse({ status: 200, description: 'Joueur mis à jour' })
  @ApiResponse({ status: 404, description: 'Joueur introuvable' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePlayerDto) {
    return this.playersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprime un joueur' })
  @ApiResponse({ status: 200, description: 'Joueur supprimé' })
  @ApiResponse({ status: 404, description: 'Joueur introuvable' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.remove(id);
  }
}
