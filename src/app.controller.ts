import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { Public } from "./auth/decorators/public.decorator";
import { HealthResponseDto } from "./common/dto/paginated-response.dto";

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
  @ApiOkResponse({
    description: "Serveur opérationnel",
    type: HealthResponseDto,
  })
  getHealth() {
    return this.appService.getHealthStatus();
  }
}
