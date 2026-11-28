import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

// Query parameters for filtering summary business KPIs
export class KpisQueryDto {
  @ApiPropertyOptional({ description: 'Filtrer par saison (ex: 2024)', example: 2024 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1990)
  season?: number;

  @ApiPropertyOptional({
    description: 'Filtrer par identifiant de compétition (ex: FR1, GB1, ES1)',
    example: 'ES1',
  })
  @IsOptional()
  @IsString()
  competition_id?: string;

  @ApiPropertyOptional({ description: 'Filtrer par identifiant de club', example: 418 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  club_id?: number;

  @ApiPropertyOptional({
    description: 'Filtrer par poste du joueur (ex: Attack, Midfield)',
    example: 'Attack',
  })
  @IsOptional()
  @IsString()
  position?: string;
}
