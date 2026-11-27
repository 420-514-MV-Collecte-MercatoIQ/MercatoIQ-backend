import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ClubsController } from "./clubs.controller";
import { ClubsService } from "./clubs.service";
import { BronzeClub, BronzeClubSchema } from "./schemas/club.schema";
import {
  BronzeCompetition,
  BronzeCompetitionSchema,
} from "./schemas/competition.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BronzeClub.name, schema: BronzeClubSchema },
      { name: BronzeCompetition.name, schema: BronzeCompetitionSchema },
    ]),
  ],
  controllers: [ClubsController],
  providers: [ClubsService],
})
export class ClubsModule {}
