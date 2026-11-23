import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SilverAppearanceDocument = HydratedDocument<SilverAppearance>;

// Silver schema for player match appearances and stats
@Schema({
  collection: 'silver_appearances',
  timestamps: false,
  versionKey: false,
})
export class SilverAppearance {
  @Prop({ required: true })
  player_id: number;

  @Prop({ required: true })
  game_id: number;

  @Prop({ required: true })
  competition_id: string;

  @Prop({ required: true })
  season: number;

  @Prop()
  position?: string;

  @Prop()
  goals?: number;

  @Prop()
  assists?: number;

  @Prop()
  yellow_cards?: number;

  @Prop()
  red_cards?: number;

  @Prop()
  minutes_played?: number;

  @Prop()
  ingested_at?: Date;
}

export const SilverAppearanceSchema =
  SchemaFactory.createForClass(SilverAppearance);

// Compound indexes for querying appearances by competition, season, and player
SilverAppearanceSchema.index({
  competition_id: 1,
  season: 1,
  player_id: 1,
  position: 1,
});
SilverAppearanceSchema.index({ player_id: 1, season: 1 });
