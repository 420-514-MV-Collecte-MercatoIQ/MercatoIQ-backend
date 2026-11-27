import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DeleteTransferResultDto } from '../common/dto/paginated-response.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferQueryDto } from './dto/transfer-query.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { TransfersService } from './transfers.service';

@ApiTags('Transfers')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Jeton JWT manquant ou invalide' })
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get()
  @ApiOperation({
    summary: 'Liste paginée et filtrée des transferts (Silver)',
    description:
      'Retourne les mouvements de transfert triés par date décroissante avec filtres par saison, ligue, poste, joueur ou club.',
  })
  @ApiResponse({ status: 200, description: 'Liste paginée des transferts et métadonnées' })
  @ApiBadRequestResponse({ description: 'Paramètres de requête invalides' })
  findAll(@Query() query: TransferQueryDto) {
    return this.transfersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupère un transfert par son _id MongoDB' })
  @ApiParam({
    name: 'id',
    example: '67461d90f8c1e2a4b9012345',
    description: 'Identifiant _id MongoDB du transfert',
  })
  @ApiResponse({ status: 200, description: 'Détails du transfert' })
  @ApiNotFoundResponse({ description: 'Transfert introuvable' })
  findOne(@Param('id') id: string) {
    return this.transfersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crée un nouveau transfert (Silver)' })
  @ApiResponse({ status: 201, description: 'Transfert créé avec succès' })
  @ApiBadRequestResponse({ description: 'Données du transfert invalides' })
  create(@Body() dto: CreateTransferDto) {
    return this.transfersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Met à jour partiellement un transfert existant' })
  @ApiParam({
    name: 'id',
    example: '67461d90f8c1e2a4b9012345',
    description: 'Identifiant _id MongoDB du transfert',
  })
  @ApiResponse({ status: 200, description: 'Transfert mis à jour' })
  @ApiBadRequestResponse({ description: 'Données de mise à jour invalides' })
  @ApiNotFoundResponse({ description: 'Transfert introuvable' })
  update(@Param('id') id: string, @Body() dto: UpdateTransferDto) {
    return this.transfersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprime un transfert par son _id MongoDB' })
  @ApiParam({
    name: 'id',
    example: '67461d90f8c1e2a4b9012345',
    description: 'Identifiant _id MongoDB du transfert',
  })
  @ApiResponse({
    status: 200,
    description: 'Transfert supprimé',
    type: DeleteTransferResultDto,
  })
  @ApiNotFoundResponse({ description: 'Transfert introuvable' })
  remove(@Param('id') id: string) {
    return this.transfersService.remove(id);
  }
}
