import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Embedded subdocument for a player's current club info
@Schema({ _id: false })
export class CurrentClub {
  @Prop({ required: true })
  club_id: number;

  @Prop({ required: true })
  club_name: string;

  @Prop()
  joined_date?: Date;

  @Prop()
  contract_expiry?: Date;
}

export const CurrentClubSchema = SchemaFactory.createForClass(CurrentClub);

// Embedded subdocument for historical market value snapshots
@Schema({ _id: false })
export class MarketValuation {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  market_value_eur: number;
}

export const MarketValuationSchema =
  SchemaFactory.createForClass(MarketValuation);

export type SilverPlayerDocument = HydratedDocument<SilverPlayer>;

// Silver schema representing cleaned player profiles and market valuations
@Schema({
  collection: 'silver_players',
  timestamps: false,
  versionKey: false,
})
export class SilverPlayer {
  @Prop({ required: true, unique: true, index: true })
  player_id: number;

  @Prop({ required: true })
  player_name: string;

  @Prop()
  date_of_birth?: Date;

  @Prop()
  nationality?: string;

  @Prop()
  position?: string;

  @Prop()
  sub_position?: string;

  @Prop()
  foot?: string;

  @Prop()
  height_cm?: number;

  @Prop({ type: CurrentClubSchema })
  current_club?: CurrentClub;

  @Prop({ type: [MarketValuationSchema], default: [] })
  market_valuations: MarketValuation[];

  @Prop()
  highest_market_value_eur?: number;

  @Prop()
  current_market_value_eur?: number;

  @Prop()
  ingested_at?: Date;
}

export const SilverPlayerSchema = SchemaFactory.createForClass(SilverPlayer);

// Indexes for filtering by nationality/position and sorting by market value
SilverPlayerSchema.index({ nationality: 1, position: 1 });
SilverPlayerSchema.index({ current_market_value_eur: -1 });
