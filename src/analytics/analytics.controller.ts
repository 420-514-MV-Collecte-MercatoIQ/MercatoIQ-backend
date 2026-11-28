import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/paginated-response.dto';
import { AnalyticsService } from './analytics.service';
import {
  ClubRoiQueryDto,
  KpisResponseDto,
  KpisQueryDto,
  PaginatedClubRoiResponseDto,
  PaginatedScoutingU23ResponseDto,
  PaginatedSuperSubsResponseDto,
  PaginatedUclVsDomesticResponseDto,
  ScoutingU23QueryDto,
  SuperSubsQueryDto,
  UclVsDomesticQueryDto,
} from './dto';

@ApiTags('Analytics (Gold)')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Jeton JWT manquant ou invalide',
  type: ErrorResponseDto,
})
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('kpis')
  @ApiOperation({
    summary: 'Indicateurs clés (KPIs) et date de mise à jour Gold',
    description:
      'Agrège les volumes Silver (apparitions, joueurs, transferts), met en avant le meilleur club ROI et le meilleur joueur UCL, et expose la fraîcheur Gold (`last_updated`).',
  })
  @ApiOkResponse({
    description: 'Résumé des KPIs analytiques',
    type: KpisResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Paramètres de filtre invalides',
    type: ErrorResponseDto,
  })
  getKpis(@Query() query: KpisQueryDto) {
    return this.analyticsService.getKpis(query);
  }

  @Get('club-roi')
  @ApiOperation({
    summary: 'Q1 : Rentabilité financière des transferts par club et saison',
    description:
      'Classe les clubs par ROI financier et contributions décisives par million d’euros investi.',
  })
  @ApiOkResponse({
    description: 'Classement paginé du ROI des clubs',
    type: PaginatedClubRoiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Paramètres de filtre ou pagination invalides',
    type: ErrorResponseDto,
  })
  getClubRoi(@Query() query: ClubRoiQueryDto) {
    return this.analyticsService.getClubRoi(query);
  }

  @Get('ucl-vs-domestic')
  @ApiOperation({
    summary: 'Q3 : Comparaison de performance Ligue des Champions vs Championnat',
    description:
      'Mesure le différentiel de buts et passes décisives par 90 minutes entre la Ligue des Champions et le championnat domestique.',
  })
  @ApiOkResponse({
    description: 'Liste paginée du différentiel UCL vs championnat domestique',
    type: PaginatedUclVsDomesticResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Paramètres de filtre ou pagination invalides',
    type: ErrorResponseDto,
  })
  getUclVsDomestic(@Query() query: UclVsDomesticQueryDto) {
    return this.analyticsService.getUclVsDomestic(query);
  }

  @Get('scouting-u23')
  @ApiOperation({
    summary: 'Q2 (ML) : Détection des joueurs U23 sous-évalués',
    description:
      'Compare la valeur marchande actuelle des joueurs U23 à la juste valeur estimée par le modèle Machine Learning.',
  })
  @ApiOkResponse({
    description: 'Liste paginée des joueurs sous-évalués selon le modèle ML',
    type: PaginatedScoutingU23ResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Paramètres de filtre ou pagination invalides',
    type: ErrorResponseDto,
  })
  getScoutingU23(@Query() query: ScoutingU23QueryDto) {
    return this.analyticsService.getScoutingU23(query);
  }

  @Get('super-subs')
  @ApiOperation({
    summary: 'Q4 : Classement d’efficacité des remplaçants (Super-Subs)',
    description:
      'Compare l’efficacité des joueurs en sortie de banc face à leur rendement en tant que titulaire.',
  })
  @ApiOkResponse({
    description: 'Liste paginée des meilleurs remplaçants',
    type: PaginatedSuperSubsResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Paramètres de filtre ou pagination invalides',
    type: ErrorResponseDto,
  })
  getSuperSubs(@Query() query: SuperSubsQueryDto) {
    return this.analyticsService.getSuperSubs(query);
  }
}
