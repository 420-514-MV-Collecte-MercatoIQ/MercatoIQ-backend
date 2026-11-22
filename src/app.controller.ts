import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";

@ApiTags("Health")
@Controller("health")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: "Vérifie la disponibilité du serveur MercatoIQ" })
  @ApiResponse({ status: 200, description: "Serveur opérationnel" })
  getHealth() {
    return this.appService.getHealthStatus();
  }
}
