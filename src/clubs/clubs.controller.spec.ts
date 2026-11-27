import { Test, TestingModule } from "@nestjs/testing";
import { ClubsController } from "./clubs.controller";
import { ClubsService } from "./clubs.service";

describe("ClubsController", () => {
  let controller: ClubsController;
  const service = {
    findCompetitions: jest.fn().mockResolvedValue([{ competition_id: "GB1" }]),
    findClubs: jest.fn().mockResolvedValue({ data: [], meta: { total: 0 } }),
    findClub: jest.fn().mockResolvedValue({ club_id: 11 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubsController],
      providers: [{ provide: ClubsService, useValue: service }],
    }).compile();

    controller = module.get(ClubsController);
  });

  it("delegates competitions to the service", async () => {
    await expect(controller.findCompetitions()).resolves.toEqual([
      { competition_id: "GB1" },
    ]);
  });

  it("passes the query to findClubs", async () => {
    const query = { competition_id: "GB1", page: 1, limit: 20 };
    await controller.findClubs(query);
    expect(service.findClubs).toHaveBeenCalledWith(query);
  });

  it("passes the id to findClub", async () => {
    await controller.findClub(11);
    expect(service.findClub).toHaveBeenCalledWith(11);
  });
});
