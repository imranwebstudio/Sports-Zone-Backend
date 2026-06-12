import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, Logger,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { MatchSyncService } from '../sports-api/match-sync.service';
import { SportsApiService } from '../sports-api/sports-api.service';
import { CreateMatchDto, UpdateMatchDto, MatchQueryDto } from './dto/match.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Matches')
@Controller('matches')
export class MatchesController {
  private readonly logger = new Logger(MatchesController.name);

  constructor(
    private readonly svc: MatchesService,
    private readonly matchSync: MatchSyncService,
    private readonly sportsApi: SportsApiService,
  ) {}

  @Get()
  findAll(@Query() query: MatchQueryDto) { return this.svc.findAll(query); }

  @Get('live')
  findLive() { return this.svc.findLive(); }

  @Get('featured')
  findFeatured() { return this.svc.findFeatured(); }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getStats() { return this.svc.getStats(); }

  // Tests the ESPN API connection — returns today's WC matches
  @Get('api-debug')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async apiDebug() {
    return this.sportsApi.testConnection();
  }

  // Auto-link existing DB matches to ESPN IDs (by team name + date)
  @Post('auto-link')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async autoLinkFixtures() {
    return this.matchSync.autoLinkFixtures();
  }

  // Import the REAL WC schedule from ESPN, creating any missing matches
  @Post('import-espn-schedule')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async importEspnSchedule() {
    return this.matchSync.importRealSchedule();
  }

  @Get(':slug/live')
  getLiveData(@Param('slug') slug: string) { return this.svc.getLiveData(slug); }

  @Get(':slug')
  findOne(@Param('slug') slug: string) { return this.svc.findOne(slug); }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() dto: CreateMatchDto) { return this.svc.create(dto); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateMatchDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
