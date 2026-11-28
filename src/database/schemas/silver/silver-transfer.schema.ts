import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type SilverTransferDocument = HydratedDocument<SilverTransfer>;

// Silver schema for player transfer records between clubs
@Schema({
  collection: 'silver_transfers',
  timestamps: false,
  versionKey: false,
})
export class SilverTransfer {
  @ApiProperty({ example: 342229, description: 'Identifiant du joueur transféré' })
  @Prop({ required: true })
  player_id: number;

  @ApiProperty({ example: 2024, description: 'Saison du transfert' })
  @Prop({ required: true })
  season: number;

  @ApiProperty({ example: 'ES1', description: 'Identifiant de la compétition' })
  @Prop({ required: true })
  competition_id: string;

  @ApiPropertyOptional({ example: 'Attack', description: 'Poste du joueur' })
  @Prop()
  position?: string;

  @ApiPropertyOptional({ example: 583, description: 'Identifiant du club de départ' })
  @Prop()
  from_club_id?: number;

  @ApiPropertyOptional({
    example: 'Paris Saint-Germain',
    description: 'Nom du club de départ',
  })
  @Prop()
  from_club_name?: string;

  @ApiPropertyOptional({ example: 418, description: 'Identifiant du club d’arrivée' })
  @Prop()
  to_club_id?: number;

  @ApiPropertyOptional({
    example: 'Real Madrid',
    description: 'Nom du club d’arrivée',
  })
  @Prop()
  to_club_name?: string;

  @ApiPropertyOptional({
    example: '2024-07-01T00:00:00.000Z',
    description: 'Date du transfert',
  })
  @Prop()
  transfer_date?: Date;

  @ApiPropertyOptional({
    example: 0,
    description: 'Indemnité de transfert en euros',
  })
  @Prop()
  transfer_fee_eur?: number;

  @ApiPropertyOptional({
    example: 180000000,
    description: 'Valeur marchande au moment du transfert en euros',
  })
  @Prop()
  market_value_at_transfer_eur?: number;

  @ApiPropertyOptional({
    enum: ['permanent', 'loan', 'free', 'end_of_loan'],
    example: 'free',
    description: 'Type de transfert',
  })
  @Prop({ enum: ['permanent', 'loan', 'free', 'end_of_loan'] })
  transfer_type?: string;

  @ApiPropertyOptional({
    example: '2026-11-26T02:03:34.555Z',
    description: 'Horodatage de normalisation Silver',
  })
  @Prop()
  ingested_at?: Date;
}

export const SilverTransferSchema =
  SchemaFactory.createForClass(SilverTransfer);

// Indexes for player and club transfer history lookups by season
SilverTransferSchema.index({
  competition_id: 1,
  season: 1,
  player_id: 1,
  position: 1,
});
SilverTransferSchema.index({ player_id: 1, season: 1 });
SilverTransferSchema.index({ to_club_id: 1, season: 1 });
SilverTransferSchema.index({ from_club_id: 1, season: 1 });
