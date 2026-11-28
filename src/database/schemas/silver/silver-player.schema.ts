import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

// Embedded subdocument for a player's current club info
@Schema({ _id: false })
export class CurrentClub {
  @ApiProperty({ example: 418, description: 'Identifiant du club' })
  @Prop({ required: true })
  club_id: number;

  @ApiProperty({ example: 'Real Madrid', description: 'Nom du club' })
  @Prop({ required: true })
  club_name: string;

  @ApiPropertyOptional({
    example: '2024-07-01T00:00:00.000Z',
    description: 'Date d’arrivée au club',
  })
  @Prop()
  joined_date?: Date;

  @ApiPropertyOptional({
    example: '2029-06-30T00:00:00.000Z',
    description: 'Date de fin de contrat',
  })
  @Prop()
  contract_expiry?: Date;
}

export const CurrentClubSchema = SchemaFactory.createForClass(CurrentClub);

// Embedded subdocument for historical market value snapshots
@Schema({ _id: false })
export class MarketValuation {
  @ApiProperty({
    example: '2024-06-01T00:00:00.000Z',
    description: 'Date de l’évaluation',
  })
  @Prop({ required: true })
  date: Date;

  @ApiProperty({
    example: 180000000,
    description: 'Valeur marchande en euros',
  })
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
  @ApiProperty({ example: 342229, description: 'Identifiant unique Transfermarkt' })
  @Prop({ required: true, unique: true, index: true })
  player_id: number;

  @ApiProperty({ example: 'Kylian Mbappé', description: 'Nom complet du joueur' })
  @Prop({ required: true })
  player_name: string;

  @ApiPropertyOptional({
    example: '1998-12-20T00:00:00.000Z',
    description: 'Date de naissance',
  })
  @Prop()
  date_of_birth?: Date;

  @ApiPropertyOptional({ example: 'France', description: 'Nationalité sportive' })
  @Prop()
  nationality?: string;

  @ApiPropertyOptional({ example: 'Attack', description: 'Poste principal' })
  @Prop()
  position?: string;

  @ApiPropertyOptional({
    example: 'Centre-Forward',
    description: 'Poste détaillé',
  })
  @Prop()
  sub_position?: string;

  @ApiPropertyOptional({ example: 'right', description: 'Pied fort' })
  @Prop()
  foot?: string;

  @ApiPropertyOptional({ example: 180, description: 'Taille en centimètres' })
  @Prop()
  height_cm?: number;

  @ApiPropertyOptional({
    type: CurrentClub,
    description: 'Résumé du club actuel (document embarqué)',
  })
  @Prop({ type: CurrentClubSchema })
  current_club?: CurrentClub;

  @ApiProperty({
    type: [MarketValuation],
    description: 'Historique récent des évaluations de valeur marchande',
  })
  @Prop({ type: [MarketValuationSchema], default: [] })
  market_valuations: MarketValuation[];

  @ApiPropertyOptional({
    example: 200000000,
    description: 'Valeur marchande maximale atteinte en euros',
  })
  @Prop()
  highest_market_value_eur?: number;

  @ApiPropertyOptional({
    example: 180000000,
    description: 'Valeur marchande actuelle en euros',
  })
  @Prop()
  current_market_value_eur?: number;

  @ApiPropertyOptional({
    example: '2026-11-26T02:03:30.010Z',
    description: 'Horodatage de normalisation Silver',
  })
  @Prop()
  ingested_at?: Date;
}

export const SilverPlayerSchema = SchemaFactory.createForClass(SilverPlayer);

// Indexes for filtering by nationality/position and sorting by market value
SilverPlayerSchema.index({ nationality: 1, position: 1 });
SilverPlayerSchema.index({ current_market_value_eur: -1 });
