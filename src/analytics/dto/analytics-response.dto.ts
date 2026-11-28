import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../common/dto/paginated-response.dto';
import {
  GoldClubTransferRoi,
  GoldSuperSubs,
  GoldUclVsDomestic,
  GoldUndervaluedScouting,
} from '../../database/schemas/gold';

export class KpisResponseDto {
  @ApiProperty({
    example: 35000,
    description: 'Nombre total d’apparitions analysées (Silver)',
  })
  total_appearances_analysed: number;

  @ApiProperty({
    example: 35000,
    description: 'Nombre total de joueurs suivis (Silver)',
  })
  total_players: number;

  @ApiProperty({
    example: 35000,
    description: 'Nombre total de transferts enregistrés (Silver)',
  })
  total_transfers: number;

  @ApiProperty({
    type: () => GoldClubTransferRoi,
    nullable: true,
    description: 'Club en tête du classement ROI pour les filtres appliqués',
  })
  top_roi_club: GoldClubTransferRoi | null;

  @ApiProperty({
    type: () => GoldUclVsDomestic,
    nullable: true,
    description: 'Joueur avec la plus forte progression UCL vs championnat',
  })
  top_ucl_step_up_player: GoldUclVsDomestic | null;

  @ApiProperty({
    example: '2026-11-26T02:03:38.224Z',
    type: String,
    nullable: true,
    description: 'Horodatage ISO du dernier calcul Gold',
  })
  last_updated: string | null;
}

export class PaginatedClubRoiResponseDto {
  @ApiProperty({
    type: () => [GoldClubTransferRoi],
    description: 'Classement paginé des clubs par ROI financier',
  })
  data: GoldClubTransferRoi[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class PaginatedUclVsDomesticResponseDto {
  @ApiProperty({
    type: () => [GoldUclVsDomestic],
    description: 'Classement paginé des différentiels UCL vs championnat',
  })
  data: GoldUclVsDomestic[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class PaginatedScoutingU23ResponseDto {
  @ApiProperty({
    type: () => [GoldUndervaluedScouting],
    description: 'Liste paginée des joueurs U23 sous-évalués (ML)',
  })
  data: GoldUndervaluedScouting[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class PaginatedSuperSubsResponseDto {
  @ApiProperty({
    type: () => [GoldSuperSubs],
    description: 'Classement paginé des meilleurs remplaçants (Super-Subs)',
  })
  data: GoldSuperSubs[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
