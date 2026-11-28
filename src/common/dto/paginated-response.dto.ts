import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { SilverPlayer } from "../../database/schemas/silver/silver-player.schema";
import { SilverTransfer } from "../../database/schemas/silver/silver-transfer.schema";

export class PaginationMetaDto {
  @ApiProperty({ example: 142, description: "Nombre total de documents correspondants" })
  total: number;

  @ApiProperty({ example: 1, description: "Page courante" })
  page: number;

  @ApiProperty({ example: 20, description: "Nombre maximal d’éléments par page" })
  limit: number;

  @ApiProperty({ example: 8, description: "Nombre total de pages" })
  totalPages: number;
}

export class ErrorResponseDto {
  @ApiProperty({ example: 400, description: "Code HTTP de l’erreur" })
  statusCode: number;

  @ApiProperty({
    description: "Message ou liste des erreurs de validation",
    oneOf: [
      { type: "string", example: "Invalid Credentials" },
      {
        type: "array",
        items: { type: "string" },
        example: ["page must not be less than 1"],
      },
    ],
  })
  message: string | string[];

  @ApiPropertyOptional({ example: "Bad Request", description: "Libellé HTTP" })
  error?: string;
}

export class HealthResponseDto {
  @ApiProperty({ example: "MercatoIQ API" })
  service: string;

  @ApiProperty({ example: "v1" })
  version: string;

  @ApiProperty({ example: "ok" })
  status: string;

  @ApiProperty({ example: "2026-11-27T14:30:00.000Z" })
  timestamp: string;
}

export class PaginatedPlayersResponseDto {
  @ApiProperty({
    type: () => [SilverPlayer],
    description: "Liste des joueurs correspondant aux filtres",
  })
  data: SilverPlayer[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class PaginatedTransfersResponseDto {
  @ApiProperty({
    type: () => [SilverTransfer],
    description: "Liste des transferts correspondant aux filtres",
  })
  data: SilverTransfer[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class DeletePlayerResultDto {
  @ApiProperty({ example: true })
  deleted: boolean;

  @ApiProperty({ example: 342229 })
  player_id: number;
}

export class DeleteTransferResultDto {
  @ApiProperty({ example: true })
  deleted: boolean;

  @ApiProperty({ example: "67461d90f8c1e2a4b9012345" })
  id: string;
}
