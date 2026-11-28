import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

// Query parameters for filtering and paginating players
export class PlayerQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Recherche par nom de joueur',
    example: 'Mbappé',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filtrer par poste (ex: Attack, Midfield)',
    example: 'Attack',
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({
    description: 'Filtrer par nationalité',
    example: 'France',
  })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({
    description: 'Filtrer par identifiant du club actuel',
    example: 418,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  club_id?: number;

  @ApiPropertyOptional({
    description: 'Filtrer par compétition (ex: FR1, GB1, ES1)',
    example: 'ES1',
  })
  @IsOptional()
  @IsString()
  competition_id?: string;

  @ApiPropertyOptional({
    description: 'Filtrer par saison (ex: 2024)',
    example: 2024,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1990)
  season?: number;
}
