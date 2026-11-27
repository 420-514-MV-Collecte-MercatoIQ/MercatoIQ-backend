import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GoldUndervaluedScoutingDocument =
  HydratedDocument<GoldUndervaluedScouting>;

// Gold schema for ML scouting valuations and undervalue ratios
@Schema({
  collection: 'gold_undervalued_scouting',
  timestamps: false,
  versionKey: false,
})
export class GoldUndervaluedScouting {
  @Prop({ required: true })
  player_id: number;

  @Prop({ required: true })
  player_name: string;

  @Prop({ required: true })
  season: number;

  @Prop({ required: true })
  competition_id: string;

  @Prop()
  position?: string;

  @Prop({ required: true })
  market_value_eur: number;

  @Prop({ required: true })
  estimated_value_eur: number;

  @Prop({ required: true })
  undervalue_ratio: number;

  @Prop()
  goals_per_90?: number;

  @Prop()
  assists_per_90?: number;

  @Prop()
  minutes_played?: number;

  @Prop()
  age?: number;

  @Prop()
  club_id?: number;

  @Prop()
  club_name?: string;

  @Prop()
  computed_at?: Date;
}

export const GoldUndervaluedScoutingSchema = SchemaFactory.createForClass(
  GoldUndervaluedScouting,
);

// Indexes for unique player-season records and ranking undervalued players
GoldUndervaluedScoutingSchema.index(
  { player_id: 1, season: 1 },
  { unique: true },
);
GoldUndervaluedScoutingSchema.index({
  competition_id: 1,
  season: 1,
  undervalue_ratio: -1,
});
GoldUndervaluedScoutingSchema.index({
  season: 1,
  position: 1,
  undervalue_ratio: -1,
});
