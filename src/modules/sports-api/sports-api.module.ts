import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../../prisma/prisma.module';
import { SportsApiService } from './sports-api.service';
import { MatchSyncService } from './match-sync.service';

@Module({
  imports: [HttpModule, PrismaModule],
  providers: [SportsApiService, MatchSyncService],
  exports: [SportsApiService, MatchSyncService],
})
export class SportsApiModule {}
