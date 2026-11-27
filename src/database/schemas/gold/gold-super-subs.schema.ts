import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GoldSuperSubsDocument = HydratedDocument<GoldSuperSubs>;

// Gold schema comparing substitute vs starter impact and super-sub scores
@Schema({
  collection: 'gold_super_subs',
  timestamps: false,
  versionKey: false,
})
export class GoldSuperSubs {
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

  @Prop()
  club_id?: number;

  @Prop()
  club_name?: string;

  @Prop({ default: 0 })
  sub_appearances: number;

  @Prop({ default: 0 })
  sub_goals: number;

  @Prop({ default: 0 })
  sub_assists: number;

  @Prop({ default: 0 })
  sub_minutes_played: number;

  @Prop({ type: Number, default: null })
  sub_goal_contributions_per_90: number | null;

  @Prop({ default: 0 })
  starter_appearances: number;

  @Prop({ default: 0 })
  starter_goals: number;

  @Prop({ default: 0 })
  starter_assists: number;

  @Prop({ default: 0 })
  starter_minutes_played: number;

  @Prop({ type: Number, default: null })
  starter_goal_contributions_per_90: number | null;

  @Prop({ type: Number, default: null })
  super_sub_score: number | null;

  @Prop()
  computed_at?: Date;
}

export const GoldSuperSubsSchema = SchemaFactory.createForClass(GoldSuperSubs);

// Indexes for unique player-season-competition records and super-sub rankings
GoldSuperSubsSchema.index(
  { player_id: 1, season: 1, competition_id: 1 },
  { unique: true },
);
GoldSuperSubsSchema.index({
  competition_id: 1,
  season: 1,
  super_sub_score: -1,
});
GoldSuperSubsSchema.index({ season: 1, position: 1, super_sub_score: -1 });
