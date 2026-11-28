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
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  DeleteTransferResultDto,
  ErrorResponseDto,
  PaginatedTransfersResponseDto,
} from '../common/dto/paginated-response.dto';
import { SilverTransfer } from '../database/schemas/silver/silver-transfer.schema';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferQueryDto } from './dto/transfer-query.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { TransfersService } from './transfers.service';

@ApiTags('Transfers')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Jeton JWT manquant ou invalide',
  type: ErrorResponseDto,
})
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get()
  @ApiOperation({
    summary: 'Liste paginée et filtrée des transferts (Silver)',
    description:
      'Retourne les mouvements de transfert triés par date décroissante avec filtres par saison, ligue, poste, joueur ou club.',
  })
  @ApiOkResponse({
    description: 'Liste paginée des transferts et métadonnées',
    type: PaginatedTransfersResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Paramètres de requête invalides',
    type: ErrorResponseDto,
  })
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
  @ApiOkResponse({
    description: 'Détails du transfert',
    type: SilverTransfer,
  })
  @ApiBadRequestResponse({
    description: 'Identifiant MongoDB invalide',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Transfert introuvable',
    type: ErrorResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.transfersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crée un nouveau transfert (Silver)' })
  @ApiCreatedResponse({
    description: 'Transfert créé avec succès',
    type: SilverTransfer,
  })
  @ApiBadRequestResponse({
    description: 'Données du transfert invalides',
    type: ErrorResponseDto,
  })
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
  @ApiOkResponse({
    description: 'Transfert mis à jour',
    type: SilverTransfer,
  })
  @ApiBadRequestResponse({
    description: 'Données de mise à jour invalides',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Transfert introuvable',
    type: ErrorResponseDto,
  })
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
  @ApiOkResponse({
    description: 'Transfert supprimé',
    type: DeleteTransferResultDto,
  })
  @ApiBadRequestResponse({
    description: 'Identifiant MongoDB invalide',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Transfert introuvable',
    type: ErrorResponseDto,
  })
  remove(@Param('id') id: string) {
    return this.transfersService.remove(id);
  }
}
