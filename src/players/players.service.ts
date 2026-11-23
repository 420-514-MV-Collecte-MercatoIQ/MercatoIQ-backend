import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SilverPlayer,
  SilverPlayerDocument,
} from '../database/schemas/silver';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerQueryDto } from './dto/player-query.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(SilverPlayer.name)
    private readonly playerModel: Model<SilverPlayerDocument>,
  ) {}

  // Get paginated players with optional filters
  async findAll(query: PlayerQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (query.name) {
      filter.player_name = { $regex: query.name, $options: 'i' };
    }
    if (query.position) {
      filter.position = query.position;
    }
    if (query.nationality) {
      filter.nationality = query.nationality;
    }
    if (query.club_id) {
      filter['current_club.club_id'] = query.club_id;
    }
    if (query.competition_id) {
      filter.competition_id = query.competition_id;
    }
    if (query.season) {
      filter.season = query.season;
    }

    const data = await this.playerModel
      .find(filter)
      .sort({ current_market_value_eur: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.playerModel.countDocuments(filter).exec();

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

  // Get one player by player_id
  async findOne(playerId: number) {
    const player = await this.playerModel
      .findOne({ player_id: playerId })
      .exec();

    if (!player) {
      throw new NotFoundException(`Player #${playerId} not found`);
    }

    return player;
  }

  // Create a new player
  async create(dto: CreatePlayerDto) {
    try {
      const player = new this.playerModel({
        ...dto,
        ingested_at: new Date(),
      });
      return await player.save();
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new ConflictException(`Player #${dto.player_id} already exists`);
      }
      throw err;
    }
  }

  // Update a player by player_id
  async update(playerId: number, dto: UpdatePlayerDto) {
    const updated = await this.playerModel
      .findOneAndUpdate({ player_id: playerId }, dto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Player #${playerId} not found`);
    }

    return updated;
  }

  // Delete a player by player_id
  async remove(playerId: number) {
    const deleted = await this.playerModel
      .findOneAndDelete({ player_id: playerId })
      .exec();

    if (!deleted) {
      throw new NotFoundException(`Player #${playerId} not found`);
    }

    return { deleted: true, player_id: playerId };
  }
}
