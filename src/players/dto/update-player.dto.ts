import { PartialType } from '@nestjs/swagger';
import { CreatePlayerDto } from './create-player.dto';

// DTO for partial updates to an existing player
export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {}
