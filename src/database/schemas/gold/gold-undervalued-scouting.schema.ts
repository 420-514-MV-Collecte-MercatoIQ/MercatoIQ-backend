import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ example: 937958, description: 'Identifiant du joueur U23' })
  @Prop({ required: true })
  player_id: number;

  @ApiProperty({ example: 'Lamine Yamal', description: 'Nom du joueur' })
  @Prop({ required: true })
  player_name: string;

  @ApiProperty({ example: 2024, description: 'Saison analysée' })
  @Prop({ required: true })
  season: number;

  @ApiProperty({ example: 'ES1', description: 'Identifiant de la compétition' })
  @Prop({ required: true })
  competition_id: string;

  @ApiPropertyOptional({ example: 'Attack', description: 'Poste du joueur' })
  @Prop()
  position?: string;

  @ApiProperty({
    example: 150000000,
    description: 'Valeur marchande Transfermarkt actuelle en euros',
  })
  @Prop({ required: true })
  market_value_eur: number;

  @ApiProperty({
    example: 185000000,
    description: 'Juste valeur estimée par le modèle ML en euros',
  })
  @Prop({ required: true })
  estimated_value_eur: number;

  @ApiProperty({
    example: 1.23,
    description: 'Ratio sous-évaluation (estimated_value_eur / market_value_eur)',
  })
  @Prop({ required: true })
  undervalue_ratio: number;

  @ApiPropertyOptional({ example: 0.45, description: 'Buts par 90 minutes' })
  @Prop()
  goals_per_90?: number;

  @ApiPropertyOptional({ example: 0.38, description: 'Passes décisives par 90 minutes' })
  @Prop()
  assists_per_90?: number;

  @ApiPropertyOptional({ example: 2150, description: 'Minutes jouées sur la saison' })
  @Prop()
  minutes_played?: number;

  @ApiPropertyOptional({ example: 19, description: 'Âge du joueur' })
  @Prop()
  age?: number;

  @ApiPropertyOptional({ example: 131, description: 'Identifiant du club' })
  @Prop()
  club_id?: number;

  @ApiPropertyOptional({ example: 'FC Barcelona', description: 'Nom du club' })
  @Prop()
  club_name?: string;

  @ApiPropertyOptional({
    example: '2026-11-26T02:03:40.000Z',
    description: 'Date de calcul de l’agrégation Gold',
  })
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
