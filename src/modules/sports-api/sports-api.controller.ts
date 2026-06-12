import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { MatchSyncService } from './match-sync.service';

@ApiTags('Sports API')
@Controller('matches')
export class SportsApiController {
  constructor(private readonly matchSync: MatchSyncService) {}

  @Post('auto-link')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  autoLink() {
    return this.matchSync.autoLinkFixtures();
  }
}
