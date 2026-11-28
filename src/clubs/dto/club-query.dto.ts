import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto";
import { TARGET_COMPETITIONS } from "../clubs.constants";

export class ClubQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: "Filtrer par championnat national",
    enum: TARGET_COMPETITIONS,
  })
  @IsOptional()
  @IsIn(TARGET_COMPETITIONS)
  competition_id?: string;

  @ApiPropertyOptional({ description: "Recherche par nom de club" })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @MaxLength(50)
  search?: string;
}
