import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import {
  ClubRoiQueryDto,
  KpisQueryDto,
  ScoutingU23QueryDto,
  SuperSubsQueryDto,
  UclVsDomesticQueryDto,
} from './dto';

@ApiTags('Analytics (Gold)')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('kpis')
  @ApiOperation({
    summary: 'Indicateurs clés (KPIs) et date de mise à jour Gold',
  })
  @ApiResponse({ status: 200, description: 'Résumé des KPIs analytiques' })
  getKpis(@Query() query: KpisQueryDto) {
    return this.analyticsService.getKpis(query);
  }

  @Get('club-roi')
  @ApiOperation({
    summary: 'Q1 : Rentabilité financière des transferts par club et saison',
  })
  @ApiResponse({ status: 200, description: 'Classement paginé du ROI des clubs' })
  getClubRoi(@Query() query: ClubRoiQueryDto) {
    return this.analyticsService.getClubRoi(query);
  }

  @Get('ucl-vs-domestic')
  @ApiOperation({
    summary: 'Q3 : Comparaison de performance Ligue des Champions vs Championnat',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée du différentiel UCL vs championnat domestique',
  })
  getUclVsDomestic(@Query() query: UclVsDomesticQueryDto) {
    return this.analyticsService.getUclVsDomestic(query);
  }

  @Get('scouting-u23')
  @ApiOperation({
    summary: 'Q2 (ML) : Détection des joueurs U23 sous-évalués',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des joueurs sous-évalués selon le modèle ML',
  })
  getScoutingU23(@Query() query: ScoutingU23QueryDto) {
    return this.analyticsService.getScoutingU23(query);
  }

  @Get('super-subs')
  @ApiOperation({
    summary: 'Q4 : Classement d’efficacité des remplaçants (Super-Subs)',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des meilleurs remplaçants',
  })
  getSuperSubs(@Query() query: SuperSubsQueryDto) {
    return this.analyticsService.getSuperSubs(query);
  }
}
