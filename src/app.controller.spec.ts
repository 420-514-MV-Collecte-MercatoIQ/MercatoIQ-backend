import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("getHealth", () => {
    it("devrait retourner le statut ok pour MercatoIQ API", () => {
      const result = appController.getHealth();
      expect(result.service).toBe("MercatoIQ API");
      expect(result.version).toBe("v1");
      expect(result.status).toBe("ok");
      expect(result.timestamp).toBeDefined();
    });
  });
});
