import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export const TRANSFER_TYPES = [
  'permanent',
  'loan',
  'free',
  'end_of_loan',
] as const;

// DTO for creating a new transfer record in the Silver layer
export class CreateTransferDto {
  @ApiProperty({ example: 342229, description: 'Identifiant du joueur' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  player_id: number;

  @ApiProperty({ example: 2024, description: 'Saison du transfert' })
  @Type(() => Number)
  @IsInt()
  @Min(1990)
  season: number;

  @ApiProperty({ example: 'ES1', description: 'Identifiant de la compétition' })
  @IsString()
  @IsNotEmpty()
  competition_id: string;

  @ApiPropertyOptional({ example: 'Attack', description: 'Poste du joueur' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ example: 583, description: 'Identifiant du club de départ' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  from_club_id?: number;

  @ApiPropertyOptional({ example: 'Paris Saint-Germain', description: 'Nom du club de départ' })
  @IsOptional()
  @IsString()
  from_club_name?: string;

  @ApiPropertyOptional({ example: 418, description: 'Identifiant du club d’arrivée' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  to_club_id?: number;

  @ApiPropertyOptional({ example: 'Real Madrid', description: 'Nom du club d’arrivée' })
  @IsOptional()
  @IsString()
  to_club_name?: string;

  @ApiPropertyOptional({ example: '2024-07-01', description: 'Date du transfert' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  transfer_date?: Date;

  @ApiPropertyOptional({ example: 0, description: 'Indemnité de transfert en euros' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  transfer_fee_eur?: number;

  @ApiPropertyOptional({
    example: 180000000,
    description: 'Valeur marchande au moment du transfert en euros',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  market_value_at_transfer_eur?: number;

  @ApiPropertyOptional({
    enum: TRANSFER_TYPES,
    example: 'free',
    description: 'Type de transfert',
  })
  @IsOptional()
  @IsIn(TRANSFER_TYPES)
  transfer_type?: string;
}
