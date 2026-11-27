import { Test } from "@nestjs/testing";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AnalyticsController } from "./analytics/analytics.controller";
import { AnalyticsService } from "./analytics/analytics.service";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { PlayersController } from "./players/players.controller";
import { PlayersService } from "./players/players.service";
import { TransfersController } from "./transfers/transfers.controller";
import { TransfersService } from "./transfers/transfers.service";

describe("Swagger OpenAPI Document", () => {
  it("documents all controllers, DTO schemas, bearer auth, and routes cleanly", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [
        AppController,
        AuthController,
        PlayersController,
        TransfersController,
        AnalyticsController,
      ],
      providers: [
        AppService,
        { provide: AuthService, useValue: {} },
        { provide: PlayersService, useValue: {} },
        { provide: TransfersService, useValue: {} },
        { provide: AnalyticsService, useValue: {} },
      ],
    }).compile();

    const app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api/v1");

    const config = new DocumentBuilder()
      .setTitle("MercatoIQ API")
      .setVersion("1.0")
      .addBearerAuth({
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      })
      .addTag("Health")
      .addTag("Auth")
      .addTag("Players")
      .addTag("Transfers")
      .addTag("Analytics (Gold)")
      .build();

    const doc = SwaggerModule.createDocument(app, config);

    expect(doc.components?.securitySchemes?.bearer).toBeDefined();
    expect(doc.paths["/api/v1/health"]?.get).toBeDefined();
    expect(doc.paths["/api/v1/auth/login"]?.post).toBeDefined();
    expect(doc.paths["/api/v1/auth/register"]?.post).toBeDefined();
    expect(doc.paths["/api/v1/players"]?.get).toBeDefined();
    expect(doc.paths["/api/v1/players/{id}"]?.get).toBeDefined();
    expect(doc.paths["/api/v1/transfers"]?.get).toBeDefined();
    expect(doc.paths["/api/v1/transfers/{id}"]?.get).toBeDefined();
    expect(doc.paths["/api/v1/analytics/kpis"]?.get).toBeDefined();
    expect(doc.paths["/api/v1/analytics/club-roi"]?.get).toBeDefined();
    expect(doc.paths["/api/v1/analytics/scouting-u23"]?.get).toBeDefined();
    expect(doc.paths["/api/v1/analytics/ucl-vs-domestic"]?.get).toBeDefined();
    expect(doc.paths["/api/v1/analytics/super-subs"]?.get).toBeDefined();

    expect(doc.components?.schemas?.LoginDto).toBeDefined();
    expect(doc.components?.schemas?.RegisterDto).toBeDefined();
    expect(doc.components?.schemas?.AuthResponseDto).toBeDefined();
    expect(doc.components?.schemas?.CreatePlayerDto).toBeDefined();
    expect(doc.components?.schemas?.CreateTransferDto).toBeDefined();

    await app.close();
  });
});
