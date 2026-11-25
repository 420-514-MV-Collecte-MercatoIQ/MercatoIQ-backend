import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

// Query parameters for filtering and paginating transfers
export class TransferQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filtrer par saison (ex: 2024)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1990)
  season?: number;

  @ApiPropertyOptional({ description: 'Filtrer par identifiant de compétition (ex: FR1, GB1, ES1)' })
  @IsOptional()
  @IsString()
  competition_id?: string;

  @ApiPropertyOptional({ description: 'Filtrer par poste du joueur (ex: Attack, Midfield)' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ description: 'Filtrer par identifiant de club' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  club_id?: number;

  @ApiPropertyOptional({ description: 'Filtrer par identifiant de joueur' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  player_id?: number;

  @ApiPropertyOptional({ description: 'Recherche par nom de club' })
  @IsOptional()
  @IsString()
  name?: string;
}
