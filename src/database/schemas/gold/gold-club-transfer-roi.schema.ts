import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type GoldClubTransferRoiDocument = HydratedDocument<GoldClubTransferRoi>;

// Gold schema aggregating transfer spending, market value gain, and ROI per club and season
@Schema({
  collection: 'gold_club_transfer_roi',
  timestamps: false,
  versionKey: false,
})
export class GoldClubTransferRoi {
  @ApiProperty({ example: 2, description: 'Identifiant du club' })
  @Prop({ required: true })
  club_id: number;

  @ApiProperty({ example: "1.FC K'lautern", description: 'Nom du club' })
  @Prop({ required: true })
  club_name: string;

  @ApiProperty({ example: 2025, description: 'Saison analysée' })
  @Prop({ required: true })
  season: number;

  @ApiPropertyOptional({
    example: 'L1',
    nullable: true,
    description: 'Identifiant de la compétition domestique',
  })
  @Prop()
  competition_id?: string;

  @ApiProperty({
    example: 3800000,
    description: 'Total des indemnités de transfert payées en euros',
  })
  @Prop({ default: 0 })
  total_fees_paid_eur: number;

  @ApiProperty({
    example: 8000000,
    description: 'Gain net de valeur marchande en euros',
  })
  @Prop({ default: 0 })
  total_value_gain_eur: number;

  @ApiProperty({
    example: 2.1053,
    type: Number,
    nullable: true,
    description: 'Retour sur investissement financier (value gain / fees paid)',
  })
  @Prop({ type: Number, default: null })
  roi: number | null;

  @ApiPropertyOptional({ example: 8, description: 'Nombre de joueurs recrutés' })
  @Prop()
  players_bought?: number;

  @ApiPropertyOptional({ example: 14, description: 'Buts des recrues' })
  @Prop({ default: 0 })
  total_goals?: number;

  @ApiPropertyOptional({ example: 9, description: 'Passes décisives des recrues' })
  @Prop({ default: 0 })
  total_assists?: number;

  @ApiPropertyOptional({ example: 23, description: 'Contributions décisives (G+A)' })
  @Prop({ default: 0 })
  total_ga?: number;

  @ApiPropertyOptional({
    example: 6.05,
    type: Number,
    nullable: true,
    description: 'Contributions décisives par million d’euros investi',
  })
  @Prop({ type: Number, default: null })
  ga_per_m_eur?: number | null;

  @ApiPropertyOptional({
    example: '2026-11-26T02:03:37.636Z',
    description: 'Date de calcul de l’agrégation Gold',
  })
  @Prop()
  computed_at?: Date;
}

export const GoldClubTransferRoiSchema =
  SchemaFactory.createForClass(GoldClubTransferRoi);

// Unique club-season constraint and index for ranking clubs by ROI
GoldClubTransferRoiSchema.index({ club_id: 1, season: 1 }, { unique: true });
GoldClubTransferRoiSchema.index({ season: 1, roi: -1 });
