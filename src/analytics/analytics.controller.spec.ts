import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;

  const mockAnalyticsService = {
    getKpis: jest.fn().mockResolvedValue({ total_appearances_analysed: 100 }),
    getClubRoi: jest.fn().mockResolvedValue({ data: [], meta: {} }),
    getUclVsDomestic: jest.fn().mockResolvedValue({ data: [], meta: {} }),
    getScoutingU23: jest.fn().mockResolvedValue({ data: [], meta: {} }),
    getSuperSubs: jest.fn().mockResolvedValue({ data: [], meta: {} }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        { provide: AnalyticsService, useValue: mockAnalyticsService },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
  });

  it('should be defined and delegate all 5 endpoints to AnalyticsService', async () => {
    expect(controller).toBeDefined();

    const kpisQuery = { season: 2024, competition_id: 'ES1' };
    await controller.getKpis(kpisQuery);
    expect(mockAnalyticsService.getKpis).toHaveBeenCalledWith(kpisQuery);

    const clubRoiQuery = { page: 1, limit: 20, season: 2024 };
    await controller.getClubRoi(clubRoiQuery);
    expect(mockAnalyticsService.getClubRoi).toHaveBeenCalledWith(clubRoiQuery);

    const uclQuery = { page: 1, limit: 20, domestic_competition_id: 'GB1' };
    await controller.getUclVsDomestic(uclQuery);
    expect(mockAnalyticsService.getUclVsDomestic).toHaveBeenCalledWith(
      uclQuery,
    );

    const scoutingQuery = { page: 1, limit: 10, position: 'Midfield' };
    await controller.getScoutingU23(scoutingQuery);
    expect(mockAnalyticsService.getScoutingU23).toHaveBeenCalledWith(
      scoutingQuery,
    );

    const superSubsQuery = { page: 1, limit: 20, club_id: 418 };
    await controller.getSuperSubs(superSubsQuery);
    expect(mockAnalyticsService.getSuperSubs).toHaveBeenCalledWith(
      superSubsQuery,
    );
  });
});
