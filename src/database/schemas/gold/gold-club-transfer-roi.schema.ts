import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GoldClubTransferRoiDocument = HydratedDocument<GoldClubTransferRoi>;

// Gold schema aggregating transfer spending, market value gain, and ROI per club and season
@Schema({
  collection: 'gold_club_transfer_roi',
  timestamps: false,
  versionKey: false,
})
export class GoldClubTransferRoi {
  @Prop({ required: true })
  club_id: number;

  @Prop({ required: true })
  club_name: string;

  @Prop({ required: true })
  season: number;

  @Prop()
  competition_id?: string;

  @Prop({ default: 0 })
  total_fees_paid_eur: number;

  @Prop({ default: 0 })
  total_value_gain_eur: number;

  @Prop({ type: Number, default: null })
  roi: number | null;

  @Prop()
  players_bought?: number;

  @Prop({ default: 0 })
  total_goals?: number;

  @Prop({ default: 0 })
  total_assists?: number;

  @Prop({ default: 0 })
  total_ga?: number;

  @Prop({ type: Number, default: null })
  ga_per_m_eur?: number | null;

  @Prop()
  computed_at?: Date;
}

export const GoldClubTransferRoiSchema =
  SchemaFactory.createForClass(GoldClubTransferRoi);

// Unique club-season constraint and index for ranking clubs by ROI
GoldClubTransferRoiSchema.index({ club_id: 1, season: 1 }, { unique: true });
GoldClubTransferRoiSchema.index({ season: 1, roi: -1 });
