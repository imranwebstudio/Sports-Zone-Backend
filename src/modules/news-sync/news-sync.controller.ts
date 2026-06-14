import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { NewsSyncService } from './news-sync.service';

@ApiTags('News Sync')
@Controller('news-sync')
export class NewsSyncController {
  constructor(private readonly svc: NewsSyncService) {}

  @Post('trigger')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  trigger() {
    return this.svc.syncNews();
  }

  @Post('backfill-content')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  backfill() {
    return this.svc.backfillContent();
  }
}
