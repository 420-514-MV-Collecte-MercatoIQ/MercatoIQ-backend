import { Test, TestingModule } from '@nestjs/testing';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';

describe('TransfersController', () => {
  let controller: TransfersController;

  const mockTransfersService = {
    findAll: jest.fn().mockResolvedValue({ data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } }),
    findOne: jest.fn().mockResolvedValue({ player_id: 342229, season: 2024, competition_id: 'ES1' }),
    create: jest.fn().mockResolvedValue({ player_id: 342229, season: 2024, competition_id: 'ES1' }),
    update: jest.fn().mockResolvedValue({ player_id: 342229, season: 2024, competition_id: 'ES1' }),
    remove: jest.fn().mockResolvedValue({ deleted: true, id: '65f000000000000000000001' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransfersController],
      providers: [{ provide: TransfersService, useValue: mockTransfersService }],
    }).compile();

    controller = module.get<TransfersController>(TransfersController);
  });

  it('should be defined and call service methods', async () => {
    expect(controller).toBeDefined();
    await controller.findAll({ page: 1, limit: 20 });
    expect(mockTransfersService.findAll).toHaveBeenCalled();

    await controller.findOne('65f000000000000000000001');
    expect(mockTransfersService.findOne).toHaveBeenCalledWith('65f000000000000000000001');

    await controller.create({ player_id: 342229, season: 2024, competition_id: 'ES1' });
    expect(mockTransfersService.create).toHaveBeenCalled();

    await controller.update('65f000000000000000000001', { transfer_fee_eur: 5000000 });
    expect(mockTransfersService.update).toHaveBeenCalledWith(
      '65f000000000000000000001',
      { transfer_fee_eur: 5000000 },
    );

    await controller.remove('65f000000000000000000001');
    expect(mockTransfersService.remove).toHaveBeenCalledWith('65f000000000000000000001');
  });
});
