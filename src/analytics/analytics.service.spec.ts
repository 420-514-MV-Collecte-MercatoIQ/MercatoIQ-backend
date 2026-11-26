import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  GoldClubTransferRoi,
  GoldSuperSubs,
  GoldUclVsDomestic,
  GoldUndervaluedScouting,
} from '../database/schemas/gold';
import {
  SilverAppearance,
  SilverPlayer,
  SilverTransfer,
} from '../database/schemas/silver';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  const olderDate = new Date('2026-11-20T10:00:00.000Z');
  const newestDate = new Date('2026-11-26T15:30:00.000Z');

  const mockClubRoi = {
    club_id: 418,
    club_name: 'Real Madrid',
    season: 2024,
    competition_id: 'ES1',
    roi: 1.45,
    total_fees_paid_eur: 50000000,
    total_value_gain_eur: 72500000,
    computed_at: olderDate,
  };

  const mockUclVsDomestic = {
    player_id: 342229,
    player_name: 'Kylian Mbappé',
    season: 2024,
    domestic_competition_id: 'ES1',
    position: 'Attack',
    club_id: 418,
    ucl_goals_per_90: 0.95,
    domestic_goals_per_90: 0.75,
    goals_per_90_delta: 0.2,
    computed_at: newestDate,
  };

  const mockScoutingU23 = {
    player_id: 580195,
    player_name: 'Jude Bellingham',
    season: 2024,
    competition_id: 'ES1',
    position: 'Midfield',
    club_id: 418,
    market_value_eur: 120000000,
    estimated_value_eur: 155000000,
    undervalue_ratio: 1.29,
    computed_at: olderDate,
  };

  const mockSuperSub = {
    player_id: 401923,
    player_name: 'Arda Güler',
    season: 2024,
    competition_id: 'ES1',
    position: 'Attack',
    club_id: 418,
    super_sub_score: 1.85,
    computed_at: olderDate,
  };

  const createPaginatedModelMock = (item: any) => ({
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([item]),
    }),
    countDocuments: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(1),
    }),
    findOne: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(item),
        }),
        exec: jest.fn().mockResolvedValue(item),
      }),
    }),
  });

  const createCountModelMock = (count: number) => ({
    countDocuments: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(count),
    }),
  });

  let clubRoiModelMock: ReturnType<typeof createPaginatedModelMock>;
  let uclVsDomesticModelMock: ReturnType<typeof createPaginatedModelMock>;
  let scoutingModelMock: ReturnType<typeof createPaginatedModelMock>;
  let superSubsModelMock: ReturnType<typeof createPaginatedModelMock>;
  let appearanceModelMock: ReturnType<typeof createCountModelMock>;
  let playerModelMock: ReturnType<typeof createCountModelMock>;
  let transferModelMock: ReturnType<typeof createCountModelMock>;

  beforeEach(async () => {
    clubRoiModelMock = createPaginatedModelMock(mockClubRoi);
    uclVsDomesticModelMock = createPaginatedModelMock(mockUclVsDomestic);
    scoutingModelMock = createPaginatedModelMock(mockScoutingU23);
    superSubsModelMock = createPaginatedModelMock(mockSuperSub);
    appearanceModelMock = createCountModelMock(125000);
    playerModelMock = createCountModelMock(5400);
    transferModelMock = createCountModelMock(18200);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getModelToken(GoldClubTransferRoi.name),
          useValue: clubRoiModelMock,
        },
        {
          provide: getModelToken(GoldUclVsDomestic.name),
          useValue: uclVsDomesticModelMock,
        },
        {
          provide: getModelToken(GoldUndervaluedScouting.name),
          useValue: scoutingModelMock,
        },
        {
          provide: getModelToken(GoldSuperSubs.name),
          useValue: superSubsModelMock,
        },
        {
          provide: getModelToken(SilverAppearance.name),
          useValue: appearanceModelMock,
        },
        {
          provide: getModelToken(SilverPlayer.name),
          useValue: playerModelMock,
        },
        {
          provide: getModelToken(SilverTransfer.name),
          useValue: transferModelMock,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should return business KPIs and newest last_updated timestamp', async () => {
    const result = await service.getKpis({
      season: 2024,
      competition_id: 'ES1',
      club_id: 418,
      position: 'Attack',
    });

    expect(result.total_appearances_analysed).toBe(125000);
    expect(result.total_players).toBe(5400);
    expect(result.total_transfers).toBe(18200);
    expect(result.top_roi_club).toEqual(mockClubRoi);
    expect(result.top_ucl_step_up_player).toEqual(mockUclVsDomestic);
    expect(result.last_updated).toBe(newestDate.toISOString());
  });

  it('should return null fallbacks in getKpis when Gold collections are empty', async () => {
    const emptyFindOne = () => ({
      sort: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
        exec: jest.fn().mockResolvedValue(null),
      }),
    });

    clubRoiModelMock.findOne.mockImplementation(emptyFindOne);
    uclVsDomesticModelMock.findOne.mockImplementation(emptyFindOne);
    scoutingModelMock.findOne.mockImplementation(emptyFindOne);
    superSubsModelMock.findOne.mockImplementation(emptyFindOne);

    const result = await service.getKpis({});

    expect(result.top_roi_club).toBeNull();
    expect(result.top_ucl_step_up_player).toBeNull();
    expect(result.last_updated).toBeNull();
  });

  it('should return paginated and filtered Q1 club ROI data', async () => {
    const result = await service.getClubRoi({
      page: 1,
      limit: 10,
      season: 2024,
      competition_id: 'ES1',
      club_id: 418,
    });

    expect(clubRoiModelMock.find).toHaveBeenCalledWith({
      season: 2024,
      competition_id: 'ES1',
      club_id: 418,
    });
    expect(result.data).toEqual([mockClubRoi]);
    expect(result.meta).toEqual({
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  it('should return paginated Q3 UCL vs Domestic data with domestic_competition_id or competition_id alias', async () => {
    await service.getUclVsDomestic({
      page: 1,
      limit: 20,
      season: 2024,
      domestic_competition_id: 'ES1',
      position: 'Attack',
      club_id: 418,
    });

    expect(uclVsDomesticModelMock.find).toHaveBeenCalledWith({
      season: 2024,
      domestic_competition_id: 'ES1',
      position: 'Attack',
      club_id: 418,
    });

    await service.getUclVsDomestic({
      page: 1,
      limit: 20,
      competition_id: 'GB1',
    });

    expect(uclVsDomesticModelMock.find).toHaveBeenCalledWith({
      domestic_competition_id: 'GB1',
    });
  });

  it('should return paginated and filtered Q2 U23 scouting data', async () => {
    const result = await service.getScoutingU23({
      page: 1,
      limit: 15,
      season: 2024,
      competition_id: 'ES1',
      position: 'Midfield',
      club_id: 418,
    });

    expect(scoutingModelMock.find).toHaveBeenCalledWith({
      season: 2024,
      competition_id: 'ES1',
      position: 'Midfield',
      club_id: 418,
    });
    expect(result.data).toEqual([mockScoutingU23]);
  });

  it('should return paginated and filtered Q4 super-subs data', async () => {
    const result = await service.getSuperSubs({
      page: 1,
      limit: 20,
      season: 2024,
      competition_id: 'ES1',
      position: 'Attack',
      club_id: 418,
    });

    expect(superSubsModelMock.find).toHaveBeenCalledWith({
      season: 2024,
      competition_id: 'ES1',
      position: 'Attack',
      club_id: 418,
    });
    expect(result.data).toEqual([mockSuperSub]);
  });
});
