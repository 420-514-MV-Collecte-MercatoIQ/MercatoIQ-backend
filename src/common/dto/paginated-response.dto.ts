import { ApiProperty } from "@nestjs/swagger";

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
