import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import {
  GoldClubTransferRoi,
  GoldClubTransferRoiDocument,
  GoldSuperSubs,
  GoldSuperSubsDocument,
  GoldUclVsDomestic,
  GoldUclVsDomesticDocument,
  GoldUndervaluedScouting,
  GoldUndervaluedScoutingDocument,
} from '../database/schemas/gold';
import {
  SilverAppearance,
  SilverAppearanceDocument,
  SilverPlayer,
  SilverPlayerDocument,
  SilverTransfer,
  SilverTransferDocument,
} from '../database/schemas/silver';
import {
  ClubRoiQueryDto,
  KpisQueryDto,
  ScoutingU23QueryDto,
  SuperSubsQueryDto,
  UclVsDomesticQueryDto,
} from './dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(GoldClubTransferRoi.name)
    private readonly clubRoiModel: Model<GoldClubTransferRoiDocument>,
    @InjectModel(GoldUclVsDomestic.name)
    private readonly uclVsDomesticModel: Model<GoldUclVsDomesticDocument>,
    @InjectModel(GoldUndervaluedScouting.name)
    private readonly scoutingModel: Model<GoldUndervaluedScoutingDocument>,
    @InjectModel(GoldSuperSubs.name)
    private readonly superSubsModel: Model<GoldSuperSubsDocument>,
    @InjectModel(SilverAppearance.name)
    private readonly appearanceModel: Model<SilverAppearanceDocument>,
    @InjectModel(SilverPlayer.name)
    private readonly playerModel: Model<SilverPlayerDocument>,
    @InjectModel(SilverTransfer.name)
    private readonly transferModel: Model<SilverTransferDocument>,
  ) {}

  // Shared pagination helper for Gold analytical queries
  private async paginate(
    model: Model<any>,
    filter: Record<string, any>,
    sort: Record<string, 1 | -1>,
    query: PaginationQueryDto,
  ) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const data = await model.find(filter).sort(sort).skip(skip).limit(limit).exec();
    const total = await model.countDocuments(filter).exec();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Find the most recent computed_at timestamp across all Gold collections
  private async getLatestGoldTimestamp(): Promise<string | null> {
    const goldModels: Model<any>[] = [
      this.clubRoiModel,
      this.uclVsDomesticModel,
      this.scoutingModel,
      this.superSubsModel,
    ];

    let latest: Date | null = null;

    for (const model of goldModels) {
      const doc = await model
        .findOne({ computed_at: { $ne: null } })
        .sort({ computed_at: -1 })
        .select('computed_at')
        .exec();

      if (doc?.computed_at) {
        const computedDate = new Date(doc.computed_at);
        if (!latest || computedDate > latest) {
          latest = computedDate;
        }
      }
    }

    return latest ? latest.toISOString() : null;
  }

  // Get summary business KPIs and freshness timestamp
  async getKpis(query: KpisQueryDto) {
    const appearanceFilter: Record<string, any> = {};
    const playerFilter: Record<string, any> = {};
    const transferFilter: Record<string, any> = {};
    const roiFilter: Record<string, any> = { roi: { $ne: null } };
    const uclFilter: Record<string, any> = { goals_per_90_delta: { $ne: null } };

    if (query.season) {
      appearanceFilter.season = query.season;
      transferFilter.season = query.season;
      roiFilter.season = query.season;
      uclFilter.season = query.season;
    }

    if (query.competition_id) {
      appearanceFilter.competition_id = query.competition_id;
      transferFilter.competition_id = query.competition_id;
      roiFilter.competition_id = query.competition_id;
      uclFilter.domestic_competition_id = query.competition_id;
    }

    if (query.position) {
      appearanceFilter.position = query.position;
      playerFilter.position = query.position;
      transferFilter.position = query.position;
      uclFilter.position = query.position;
    }

    if (query.club_id) {
      playerFilter['current_club.club_id'] = query.club_id;
      transferFilter.$or = [
        { from_club_id: query.club_id },
        { to_club_id: query.club_id },
      ];
      roiFilter.club_id = query.club_id;
      uclFilter.club_id = query.club_id;
    }

    const totalAppearances = await this.appearanceModel
      .countDocuments(appearanceFilter)
      .exec();
    const totalPlayers = await this.playerModel
      .countDocuments(playerFilter)
      .exec();
    const totalTransfers = await this.transferModel
      .countDocuments(transferFilter)
      .exec();

    const topRoiClub = await this.clubRoiModel
      .findOne(roiFilter)
      .sort({ roi: -1 })
      .exec();

    const topUclStepUpPlayer = await this.uclVsDomesticModel
      .findOne(uclFilter)
      .sort({ goals_per_90_delta: -1 })
      .exec();

    const lastUpdated = await this.getLatestGoldTimestamp();

    return {
      total_appearances_analysed: totalAppearances,
      total_players: totalPlayers,
      total_transfers: totalTransfers,
      top_roi_club: topRoiClub || null,
      top_ucl_step_up_player: topUclStepUpPlayer || null,
      last_updated: lastUpdated,
    };
  }

  // Q1: Club Financial Transfer ROI
  async getClubRoi(query: ClubRoiQueryDto) {
    const filter: Record<string, any> = {};

    if (query.season) {
      filter.season = query.season;
    }
    if (query.competition_id) {
      filter.competition_id = query.competition_id;
    }
    if (query.club_id) {
      filter.club_id = query.club_id;
    }

    return this.paginate(
      this.clubRoiModel,
      filter,
      { roi: -1, total_value_gain_eur: -1 },
      query,
    );
  }

  // Q3: UEFA Champions League vs Domestic League performance
  async getUclVsDomestic(query: UclVsDomesticQueryDto) {
    const filter: Record<string, any> = {};
    const domesticComp = query.domestic_competition_id || query.competition_id;

    if (query.season) {
      filter.season = query.season;
    }
    if (domesticComp) {
      filter.domestic_competition_id = domesticComp;
    }
    if (query.position) {
      filter.position = query.position;
    }
    if (query.club_id) {
      filter.club_id = query.club_id;
    }

    return this.paginate(
      this.uclVsDomesticModel,
      filter,
      { goals_per_90_delta: -1 },
      query,
    );
  }

  // Q2: Undervalued U23 Scouting (ML fair value vs market value)
  async getScoutingU23(query: ScoutingU23QueryDto) {
    const filter: Record<string, any> = {};

    if (query.season) {
      filter.season = query.season;
    }
    if (query.competition_id) {
      filter.competition_id = query.competition_id;
    }
    if (query.position) {
      filter.position = query.position;
    }
    if (query.club_id) {
      filter.club_id = query.club_id;
    }

    return this.paginate(
      this.scoutingModel,
      filter,
      { undervalue_ratio: -1 },
      query,
    );
  }

  // Q4: Super-Subs impact ranking
  async getSuperSubs(query: SuperSubsQueryDto) {
    const filter: Record<string, any> = {};

    if (query.season) {
      filter.season = query.season;
    }
    if (query.competition_id) {
      filter.competition_id = query.competition_id;
    }
    if (query.position) {
      filter.position = query.position;
    }
    if (query.club_id) {
      filter.club_id = query.club_id;
    }

    return this.paginate(
      this.superSubsModel,
      filter,
      { super_sub_score: -1 },
      query,
    );
  }
}
