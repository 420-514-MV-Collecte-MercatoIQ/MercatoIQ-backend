import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ClubQueryDto } from "./club-query.dto";

const errorsFor = async (query: Record<string, string>) => {
  const dto = plainToInstance(ClubQueryDto, query);
  return (await validate(dto)).map((e) => e.property);
};

describe("ClubQueryDto", () => {
  it("accepts a valid query", async () => {
    await expect(
      errorsFor({
        competition_id: "GB1",
        search: " Arsenal ",
        page: "1",
        limit: "20",
      }),
    ).resolves.toEqual([]);
  });

  it("rejects a competition outside the project", async () => {
    await expect(errorsFor({ competition_id: "NL1" })).resolves.toEqual([
      "competition_id",
    ]);
  });

  it("rejects a search longer than 50 characters", async () => {
    await expect(errorsFor({ search: "x".repeat(51) })).resolves.toEqual([
      "search",
    ]);
  });

  it("rejects a limit above 100", async () => {
    await expect(errorsFor({ limit: "500" })).resolves.toEqual(["limit"]);
  });
});
