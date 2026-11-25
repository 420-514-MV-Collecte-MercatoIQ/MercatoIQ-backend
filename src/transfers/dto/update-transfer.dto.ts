import { PartialType } from '@nestjs/swagger';
import { CreateTransferDto } from './create-transfer.dto';

// DTO for partial updates to an existing transfer record
export class UpdateTransferDto extends PartialType(CreateTransferDto) {}
