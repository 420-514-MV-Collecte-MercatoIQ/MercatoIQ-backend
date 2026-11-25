import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

// DTO for embedded current club data
export class CurrentClubDto {
  @ApiProperty({ example: 583, description: 'Identifiant du club' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  club_id: number;

  @ApiProperty({ example: 'Paris Saint-Germain', description: 'Nom du club' })
  @IsString()
  @IsNotEmpty()
  club_name: string;

  @ApiPropertyOptional({ example: '2023-07-01', description: 'Date d’arrivée au club' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  joined_date?: Date;

  @ApiPropertyOptional({ example: '2028-06-30', description: 'Date de fin de contrat' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  contract_expiry?: Date;
}

// DTO for a single market valuation snapshot
export class MarketValuationDto {
  @ApiProperty({ example: '2024-06-01', description: 'Date de l’évaluation' })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({ example: 50000000, description: 'Valeur marchande en euros' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  market_value_eur: number;
}

// DTO for creating a new player in the Silver layer
export class CreatePlayerDto {
  @ApiProperty({ example: 342229, description: 'Identifiant unique Transfermarkt du joueur' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  player_id: number;

  @ApiProperty({ example: 'Kylian Mbappé', description: 'Nom complet du joueur' })
  @IsString()
  @IsNotEmpty()
  player_name: string;

  @ApiPropertyOptional({ example: '1998-12-20', description: 'Date de naissance' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date_of_birth?: Date;

  @ApiPropertyOptional({ example: 'France', description: 'Nationalité du joueur' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({ example: 'Attack', description: 'Poste principal' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ example: 'Centre-Forward', description: 'Sous-poste spécifique' })
  @IsOptional()
  @IsString()
  sub_position?: string;

  @ApiPropertyOptional({ example: 'right', description: 'Pied fort' })
  @IsOptional()
  @IsString()
  foot?: string;

  @ApiPropertyOptional({ example: 178, description: 'Taille en centimètres' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(100)
  height_cm?: number;

  @ApiPropertyOptional({ type: CurrentClubDto, description: 'Club actuel du joueur' })
  @IsOptional()
  @ValidateNested()
  @Type(() => CurrentClubDto)
  current_club?: CurrentClubDto;

  @ApiPropertyOptional({
    type: [MarketValuationDto],
    description: 'Historique des valeurs marchandes',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarketValuationDto)
  market_valuations?: MarketValuationDto[];

  @ApiPropertyOptional({ example: 200000000, description: 'Plus haute valeur marchande en euros' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  highest_market_value_eur?: number;

  @ApiPropertyOptional({ example: 180000000, description: 'Valeur marchande actuelle en euros' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  current_market_value_eur?: number;
}
