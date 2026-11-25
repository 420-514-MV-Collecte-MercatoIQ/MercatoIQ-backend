import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SilverTransferDocument = HydratedDocument<SilverTransfer>;

// Silver schema for player transfer records between clubs
@Schema({
  collection: 'silver_transfers',
  timestamps: false,
  versionKey: false,
})
export class SilverTransfer {
  @Prop({ required: true })
  player_id: number;

  @Prop({ required: true })
  season: number;

  @Prop({ required: true })
  competition_id: string;

  @Prop()
  position?: string;

  @Prop()
  from_club_id?: number;

  @Prop()
  from_club_name?: string;

  @Prop()
  to_club_id?: number;

  @Prop()
  to_club_name?: string;

  @Prop()
  transfer_date?: Date;

  @Prop()
  transfer_fee_eur?: number;

  @Prop()
  market_value_at_transfer_eur?: number;

  @Prop({ enum: ['permanent', 'loan', 'free', 'end_of_loan'] })
  transfer_type?: string;

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
