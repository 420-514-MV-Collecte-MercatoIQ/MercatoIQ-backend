import { ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SilverPlayer } from '../database/schemas/silver';
import { PlayersService } from './players.service';

describe('PlayersService', () => {
  let service: PlayersService;

  const mockPlayer = {
    player_id: 342229,
    player_name: 'Kylian Mbappé',
    nationality: 'France',
    position: 'Attack',
  };

  const mockPlayerModel: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ ...mockPlayer, ...dto }),
  }));

  mockPlayerModel.find = jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([mockPlayer]),
  });
  mockPlayerModel.countDocuments = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(1),
  });
  mockPlayerModel.findOne = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockPlayer),
  });
  mockPlayerModel.findOneAndUpdate = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockPlayer),
  });
  mockPlayerModel.findOneAndDelete = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockPlayer),
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        {
          provide: getModelToken(SilverPlayer.name),
          useValue: mockPlayerModel,
        },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
  });

  it('should return paginated players', async () => {
    const result = await service.findAll({
      page: 1,
      limit: 10,
      name: 'Mbappé',
      position: 'Attack',
    });

    expect(mockPlayerModel.find).toHaveBeenCalled();
    expect(result.data).toEqual([mockPlayer]);
    expect(result.meta.total).toBe(1);
  });

  it('should find a player by player_id', async () => {
    const player = await service.findOne(342229);
    expect(player).toEqual(mockPlayer);
  });

  it('should throw NotFoundException if player is not found', async () => {
    mockPlayerModel.findOne.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    });
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should create a player', async () => {
    const created = await service.create({
      player_id: 342229,
      player_name: 'Kylian Mbappé',
    });
    expect(created.player_id).toBe(342229);
  });

  it('should throw ConflictException on duplicate player_id', async () => {
    mockPlayerModel.mockImplementationOnce(() => ({
      save: jest.fn().mockRejectedValue({ code: 11000 }),
    }));
    await expect(
      service.create({ player_id: 342229, player_name: 'Kylian Mbappé' }),
    ).rejects.toThrow(ConflictException);
  });

  it('should update a player', async () => {
    const updated = await service.update(342229, { position: 'Attack' });
    expect(updated).toEqual(mockPlayer);
  });

  it('should delete a player', async () => {
    const res = await service.remove(342229);
    expect(res).toEqual({ deleted: true, player_id: 342229 });
  });
});
