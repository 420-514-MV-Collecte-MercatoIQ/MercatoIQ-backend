import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

// Query parameters for Q3 UCL vs Domestic performance endpoint
export class UclVsDomesticQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filtrer par saison (ex: 2024)', example: 2012 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1990)
  season?: number;

  @ApiPropertyOptional({
    description: 'Filtrer par ligue domestique (ex: GB1, ES1, IT1, L1, FR1)',
    example: 'L1',
  })
  @IsOptional()
  @IsString()
  domestic_competition_id?: string;

  @ApiPropertyOptional({
    description: 'Alias pour filtrer par compétition domestique',
    example: 'L1',
  })
  @IsOptional()
  @IsString()
  competition_id?: string;

  @ApiPropertyOptional({
    description: 'Filtrer par poste du joueur (ex: Attack, Midfield)',
    example: 'Attack',
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ description: 'Filtrer par identifiant de club', example: 16 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  club_id?: number;
}
