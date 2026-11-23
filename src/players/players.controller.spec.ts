import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

describe('PlayersController', () => {
  let controller: PlayersController;

  const mockPlayersService = {
    findAll: jest.fn().mockResolvedValue({ data: [], meta: {} }),
    findOne: jest.fn().mockResolvedValue({ player_id: 342229 }),
    create: jest.fn().mockResolvedValue({ player_id: 342229 }),
    update: jest.fn().mockResolvedValue({ player_id: 342229 }),
    remove: jest.fn().mockResolvedValue({ deleted: true, player_id: 342229 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [{ provide: PlayersService, useValue: mockPlayersService }],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
  });

  it('should call service methods', async () => {
    await controller.findAll({ page: 1, limit: 20 });
    expect(mockPlayersService.findAll).toHaveBeenCalled();

    await controller.findOne(342229);
    expect(mockPlayersService.findOne).toHaveBeenCalledWith(342229);

    await controller.create({ player_id: 342229, player_name: 'Kylian Mbappé' });
    expect(mockPlayersService.create).toHaveBeenCalled();

    await controller.update(342229, { position: 'Attack' });
    expect(mockPlayersService.update).toHaveBeenCalledWith(342229, {
      position: 'Attack',
    });

    await controller.remove(342229);
    expect(mockPlayersService.remove).toHaveBeenCalledWith(342229);
  });
});
