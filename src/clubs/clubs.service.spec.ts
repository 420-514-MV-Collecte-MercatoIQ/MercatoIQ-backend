import { NotFoundException } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { ClubsService } from "./clubs.service";
import { BronzeClub } from "./schemas/club.schema";
import { BronzeCompetition } from "./schemas/competition.schema";

const queryChain = (result: unknown) => {
  const chain: any = {};
  for (const fn of ["select", "sort", "skip", "limit", "lean"]) {
    chain[fn] = jest.fn().mockReturnValue(chain);
  }
  chain.exec = jest.fn().mockResolvedValue(result);
  return chain;
};

describe("ClubsService", () => {
  let service: ClubsService;
  const arsenal = {
    club_id: 11,
    name: "Arsenal FC",
    domestic_competition_id: "GB1",
  };
  const clubModel: any = {};
  const competitionModel: any = {};

  beforeEach(async () => {
    clubModel.find = jest.fn().mockReturnValue(queryChain([arsenal]));
    clubModel.findOne = jest.fn().mockReturnValue(queryChain(arsenal));
    clubModel.countDocuments = jest.fn().mockReturnValue(queryChain(21));
    competitionModel.find = jest
      .fn()
      .mockReturnValue(
        queryChain([{ competition_id: "GB1", name: "premier-league" }]),
      );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubsService,
        { provide: getModelToken(BronzeClub.name), useValue: clubModel },
        {
          provide: getModelToken(BronzeCompetition.name),
          useValue: competitionModel,
        },
      ],
    }).compile();

    service = module.get(ClubsService);
  });

  it("returns only the 6 project competitions", async () => {
    const result = await service.findCompetitions();

    expect(competitionModel.find).toHaveBeenCalledWith({
      competition_id: { $in: ["GB1", "ES1", "IT1", "L1", "FR1", "CL"] },
    });
    expect(result).toHaveLength(1);
  });

  it("returns paginated clubs with meta", async () => {
    const result = await service.findClubs({ page: 2, limit: 10 });
    const chain = clubModel.find.mock.results[0].value;

    expect(chain.skip).toHaveBeenCalledWith(10);
    expect(chain.limit).toHaveBeenCalledWith(10);
    expect(result).toEqual({
      data: [arsenal],
      meta: { total: 21, page: 2, limit: 10, totalPages: 3 },
    });
  });

  it("filters by competition and escaped search", async () => {
    await service.findClubs({ competition_id: "GB1", search: "a.c (milan)" });

    expect(clubModel.find).toHaveBeenCalledWith({
      domestic_competition_id: "GB1",
      name: { $regex: "a\\.c \\(milan\\)", $options: "i" },
    });
  });

  it("returns one club by club_id", async () => {
    await expect(service.findClub(11)).resolves.toEqual(arsenal);
    expect(clubModel.findOne).toHaveBeenCalledWith({ club_id: 11 });
  });

  it("throws 404 when the club does not exist", async () => {
    clubModel.findOne.mockReturnValue(queryChain(null));

    await expect(service.findClub(999999)).rejects.toThrow(NotFoundException);
  });
});
