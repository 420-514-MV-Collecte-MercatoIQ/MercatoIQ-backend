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
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferQueryDto } from './dto/transfer-query.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { TransfersService } from './transfers.service';

@ApiTags('Transfers')
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get()
  @ApiOperation({
    summary: 'Liste paginée et filtrée des transferts (Silver)',
  })
  @ApiResponse({ status: 200, description: 'Liste paginée des transferts' })
  findAll(@Query() query: TransferQueryDto) {
    return this.transfersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupère un transfert par son _id MongoDB' })
  @ApiParam({ name: 'id', description: 'Identifiant _id MongoDB du transfert' })
  @ApiResponse({ status: 200, description: 'Détails du transfert' })
  @ApiResponse({ status: 404, description: 'Transfert introuvable' })
  findOne(@Param('id') id: string) {
    return this.transfersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crée un nouveau transfert (Silver)' })
  @ApiResponse({ status: 201, description: 'Transfert créé avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  create(@Body() dto: CreateTransferDto) {
    return this.transfersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Met à jour partiellement un transfert existant' })
  @ApiParam({ name: 'id', description: 'Identifiant _id MongoDB du transfert' })
  @ApiResponse({ status: 200, description: 'Transfert mis à jour' })
  @ApiResponse({ status: 404, description: 'Transfert introuvable' })
  update(@Param('id') id: string, @Body() dto: UpdateTransferDto) {
    return this.transfersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprime un transfert par son _id MongoDB' })
  @ApiParam({ name: 'id', description: 'Identifiant _id MongoDB du transfert' })
  @ApiResponse({ status: 200, description: 'Transfert supprimé' })
  @ApiResponse({ status: 404, description: 'Transfert introuvable' })
  remove(@Param('id') id: string) {
    return this.transfersService.remove(id);
  }
}
