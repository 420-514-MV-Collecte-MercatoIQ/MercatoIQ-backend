import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { Public } from "./auth/decorators/public.decorator";

@ApiTags("Health")
@Controller("health")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "Vérifie la disponibilité du serveur MercatoIQ",
    description:
      "Endpoint public de contrôle de santé utilisé par le monitoring et le frontend pour vérifier l’état de l’API.",
  })
  @ApiResponse({
    status: 200,
    description: "Serveur opérationnel",
    schema: {
      example: {
        service: "MercatoIQ API",
        version: "v1",
        status: "ok",
        timestamp: "2026-11-27T14:30:00.000Z",
      },
    },
  })
  getHealth() {
    return this.appService.getHealthStatus();
  }
}
