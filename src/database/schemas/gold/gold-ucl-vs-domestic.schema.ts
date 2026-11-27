import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GoldUclVsDomesticDocument = HydratedDocument<GoldUclVsDomestic>;

// Gold schema comparing player performance in UEFA Champions League vs domestic leagues
@Schema({
  collection: 'gold_ucl_vs_domestic',
  timestamps: false,
  versionKey: false,
})
export class GoldUclVsDomestic {
  @Prop({ required: true })
  player_id: number;

  @Prop({ required: true })
  player_name: string;

  @Prop({ required: true })
  season: number;

  @Prop()
  position?: string;

  @Prop()
  club_id?: number;

  @Prop()
  club_name?: string;

  @Prop({ default: 0 })
  ucl_appearances: number;

  @Prop({ default: 0 })
  ucl_goals: number;

  @Prop({ default: 0 })
  ucl_assists: number;

  @Prop({ default: 0 })
  ucl_minutes_played: number;

  @Prop({ type: Number, default: null })
  ucl_goals_per_90: number | null;

  @Prop({ type: Number, default: null })
  ucl_ga_per_90?: number | null;

  @Prop({ required: true })
  domestic_competition_id: string;

  @Prop({ default: 0 })
  domestic_appearances: number;

  @Prop({ default: 0 })
  domestic_goals: number;

  @Prop({ default: 0 })
  domestic_assists: number;

  @Prop({ default: 0 })
  domestic_minutes_played: number;

  @Prop({ type: Number, default: null })
  domestic_goals_per_90: number | null;

  @Prop({ type: Number, default: null })
  domestic_ga_per_90?: number | null;

  @Prop({ type: Number, default: null })
  goals_per_90_delta: number | null;

  @Prop({ type: Number, default: null })
  ga_per_90_delta?: number | null;

  @Prop()
  computed_at?: Date;
}

export const GoldUclVsDomesticSchema =
  SchemaFactory.createForClass(GoldUclVsDomestic);

// Indexes for unique player-season records and sorting by performance delta
GoldUclVsDomesticSchema.index({ player_id: 1, season: 1 }, { unique: true });
GoldUclVsDomesticSchema.index({ season: 1, goals_per_90_delta: -1 });
GoldUclVsDomesticSchema.index({
  domestic_competition_id: 1,
  season: 1,
  position: 1,
});
