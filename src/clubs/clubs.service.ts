import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { TARGET_COMPETITIONS } from "./clubs.constants";
import { ClubQueryDto } from "./dto/club-query.dto";
import { BronzeClub, BronzeClubDocument } from "./schemas/club.schema";
import {
  BronzeCompetition,
  BronzeCompetitionDocument,
} from "./schemas/competition.schema";

const HIDDEN_FIELDS = "-_id -_ingested_at -_source";

@Injectable()
export class ClubsService {
  constructor(
    @InjectModel(BronzeClub.name)
    private readonly clubModel: Model<BronzeClubDocument>,
    @InjectModel(BronzeCompetition.name)
    private readonly competitionModel: Model<BronzeCompetitionDocument>,
  ) {}

  async findCompetitions() {
    return this.competitionModel
      .find({ competition_id: { $in: TARGET_COMPETITIONS } })
      .select(HIDDEN_FIELDS)
      .sort({ competition_id: 1 })
      .lean()
      .exec();
  }

  async findClubs(query: ClubQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const filter: FilterQuery<BronzeClub> = {};

    if (query.competition_id) {
      filter.domestic_competition_id = query.competition_id;
    }
    if (query.search) {
      filter.name = { $regex: escapeRegex(query.search), $options: "i" };
    }

    const [data, total] = await Promise.all([
      this.clubModel
        .find(filter)
        .select(HIDDEN_FIELDS)
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.clubModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findClub(clubId: number) {
    const club = await this.clubModel
      .findOne({ club_id: clubId })
      .select(HIDDEN_FIELDS)
      .lean()
      .exec();

    if (!club) {
      throw new NotFoundException(`Le club ${clubId} n'existe pas.`);
    }
    return club;
  }
}

// Empêche l'injection de regex
function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
