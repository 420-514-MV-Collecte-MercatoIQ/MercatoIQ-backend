import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type GoldSuperSubsDocument = HydratedDocument<GoldSuperSubs>;

// Gold schema comparing substitute vs starter impact and super-sub scores
@Schema({
  collection: 'gold_super_subs',
  timestamps: false,
  versionKey: false,
})
export class GoldSuperSubs {
  @ApiProperty({ example: 401923, description: 'Identifiant du joueur' })
  @Prop({ required: true })
  player_id: number;

  @ApiProperty({ example: 'Jhon Durán', description: 'Nom du joueur' })
  @Prop({ required: true })
  player_name: string;

  @ApiProperty({ example: 2024, description: 'Saison analysée' })
  @Prop({ required: true })
  season: number;

  @ApiProperty({ example: 'GB1', description: 'Identifiant de la compétition' })
  @Prop({ required: true })
  competition_id: string;

  @ApiPropertyOptional({ example: 'Attack', description: 'Poste du joueur' })
  @Prop()
  position?: string;

  @ApiPropertyOptional({ example: 405, description: 'Identifiant du club' })
  @Prop()
  club_id?: number;

  @ApiPropertyOptional({ example: 'Aston Villa', description: 'Nom du club' })
  @Prop()
  club_name?: string;

  @ApiProperty({ example: 18, description: 'Entrées en jeu comme remplaçant' })
  @Prop({ default: 0 })
  sub_appearances: number;

  @ApiProperty({ example: 7, description: 'Buts marqués en sortie de banc' })
  @Prop({ default: 0 })
  sub_goals: number;

  @ApiProperty({ example: 2, description: 'Passes décisives en sortie de banc' })
  @Prop({ default: 0 })
  sub_assists: number;

  @ApiProperty({ example: 420, description: 'Minutes jouées comme remplaçant' })
  @Prop({ default: 0 })
  sub_minutes_played: number;

  @ApiProperty({
    example: 1.93,
    type: Number,
    nullable: true,
    description: 'G+A par 90 minutes en sortie de banc',
  })
  @Prop({ type: Number, default: null })
  sub_goal_contributions_per_90: number | null;

  @ApiProperty({ example: 6, description: 'Apparitions en tant que titulaire' })
  @Prop({ default: 0 })
  starter_appearances: number;

  @ApiProperty({ example: 2, description: 'Buts en tant que titulaire' })
  @Prop({ default: 0 })
  starter_goals: number;

  @ApiProperty({ example: 1, description: 'Passes décisives en tant que titulaire' })
  @Prop({ default: 0 })
  starter_assists: number;

  @ApiProperty({ example: 480, description: 'Minutes jouées en tant que titulaire' })
  @Prop({ default: 0 })
  starter_minutes_played: number;

  @ApiProperty({
    example: 0.56,
    type: Number,
    nullable: true,
    description: 'G+A par 90 minutes en tant que titulaire',
  })
  @Prop({ type: Number, default: null })
  starter_goal_contributions_per_90: number | null;

  @ApiProperty({
    example: 1.37,
    type: Number,
    nullable: true,
    description: 'Score composite d’impact en sortie de banc',
  })
  @Prop({ type: Number, default: null })
  super_sub_score: number | null;

  @ApiPropertyOptional({
    example: '2026-11-26T02:03:41.000Z',
    description: 'Date de calcul de l’agrégation Gold',
  })
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
