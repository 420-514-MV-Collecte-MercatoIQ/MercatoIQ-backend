import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type GoldUclVsDomesticDocument = HydratedDocument<GoldUclVsDomestic>;

// Gold schema comparing player performance in UEFA Champions League vs domestic leagues
@Schema({
  collection: 'gold_ucl_vs_domestic',
  timestamps: false,
  versionKey: false,
})
export class GoldUclVsDomestic {
  @ApiProperty({ example: 342229, description: 'Identifiant du joueur' })
  @Prop({ required: true })
  player_id: number;

  @ApiProperty({ example: 'Kylian Mbappé', description: 'Nom du joueur' })
  @Prop({ required: true })
  player_name: string;

  @ApiProperty({ example: 2024, description: 'Saison analysée' })
  @Prop({ required: true })
  season: number;

  @ApiPropertyOptional({ example: 'Attack', description: 'Poste du joueur' })
  @Prop()
  position?: string;

  @ApiPropertyOptional({ example: 418, description: 'Identifiant du club' })
  @Prop()
  club_id?: number;

  @ApiPropertyOptional({ example: 'Real Madrid', description: 'Nom du club' })
  @Prop()
  club_name?: string;

  @ApiProperty({ example: 8, description: 'Apparitions en Ligue des Champions' })
  @Prop({ default: 0 })
  ucl_appearances: number;

  @ApiProperty({ example: 6, description: 'Buts en Ligue des Champions' })
  @Prop({ default: 0 })
  ucl_goals: number;

  @ApiProperty({ example: 2, description: 'Passes décisives en Ligue des Champions' })
  @Prop({ default: 0 })
  ucl_assists: number;

  @ApiProperty({ example: 680, description: 'Minutes jouées en Ligue des Champions' })
  @Prop({ default: 0 })
  ucl_minutes_played: number;

  @ApiProperty({
    example: 0.79,
    type: Number,
    nullable: true,
    description: 'Buts par 90 minutes en Ligue des Champions',
  })
  @Prop({ type: Number, default: null })
  ucl_goals_per_90: number | null;

  @ApiPropertyOptional({
    example: 1.06,
    type: Number,
    nullable: true,
    description: 'Buts + passes décisives par 90 minutes en Ligue des Champions',
  })
  @Prop({ type: Number, default: null })
  ucl_ga_per_90?: number | null;

  @ApiProperty({ example: 'ES1', description: 'Identifiant du championnat domestique' })
  @Prop({ required: true })
  domestic_competition_id: string;

  @ApiProperty({ example: 28, description: 'Apparitions en championnat domestique' })
  @Prop({ default: 0 })
  domestic_appearances: number;

  @ApiProperty({ example: 18, description: 'Buts en championnat domestique' })
  @Prop({ default: 0 })
  domestic_goals: number;

  @ApiProperty({ example: 5, description: 'Passes décisives en championnat domestique' })
  @Prop({ default: 0 })
  domestic_assists: number;

  @ApiProperty({ example: 2340, description: 'Minutes jouées en championnat domestique' })
  @Prop({ default: 0 })
  domestic_minutes_played: number;

  @ApiProperty({
    example: 0.69,
    type: Number,
    nullable: true,
    description: 'Buts par 90 minutes en championnat domestique',
  })
  @Prop({ type: Number, default: null })
  domestic_goals_per_90: number | null;

  @ApiPropertyOptional({
    example: 0.88,
    type: Number,
    nullable: true,
    description: 'Buts + passes décisives par 90 minutes en championnat domestique',
  })
  @Prop({ type: Number, default: null })
  domestic_ga_per_90?: number | null;

  @ApiProperty({
    example: 0.1,
    type: Number,
    nullable: true,
    description: 'Différentiel de buts/90 (UCL - championnat)',
  })
  @Prop({ type: Number, default: null })
  goals_per_90_delta: number | null;

  @ApiPropertyOptional({
    example: 0.18,
    type: Number,
    nullable: true,
    description: 'Différentiel de G+A/90 (UCL - championnat)',
  })
  @Prop({ type: Number, default: null })
  ga_per_90_delta?: number | null;

  @ApiPropertyOptional({
    example: '2026-11-26T02:03:38.224Z',
    description: 'Date de calcul de l’agrégation Gold',
  })
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
