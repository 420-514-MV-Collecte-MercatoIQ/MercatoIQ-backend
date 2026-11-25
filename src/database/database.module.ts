import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SilverPlayer,
  SilverPlayerSchema,
  SilverAppearance,
  SilverAppearanceSchema,
  SilverTransfer,
  SilverTransferSchema,
} from './schemas/silver';
import {
  GoldClubTransferRoi,
  GoldClubTransferRoiSchema,
  GoldUndervaluedScouting,
  GoldUndervaluedScoutingSchema,
  GoldUclVsDomestic,
  GoldUclVsDomesticSchema,
  GoldSuperSubs,
  GoldSuperSubsSchema,
} from './schemas/gold';

// Register Silver layer collections
const SILVER_MODELS = MongooseModule.forFeature([
  { name: SilverPlayer.name, schema: SilverPlayerSchema },
  { name: SilverAppearance.name, schema: SilverAppearanceSchema },
  { name: SilverTransfer.name, schema: SilverTransferSchema },
]);

// Register Gold layer analytical collections
const GOLD_MODELS = MongooseModule.forFeature([
  { name: GoldClubTransferRoi.name, schema: GoldClubTransferRoiSchema },
  { name: GoldUndervaluedScouting.name, schema: GoldUndervaluedScoutingSchema },
  { name: GoldUclVsDomestic.name, schema: GoldUclVsDomesticSchema },
  { name: GoldSuperSubs.name, schema: GoldSuperSubsSchema },
]);

// Central database module exporting Silver and Gold Mongoose models
@Module({
  imports: [SILVER_MODELS, GOLD_MODELS],
  exports: [SILVER_MODELS, GOLD_MODELS],
})
export class DatabaseModule {}
