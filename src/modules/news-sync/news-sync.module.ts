import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../../prisma/prisma.module';
import { NewsSyncService } from './news-sync.service';
import { NewsSyncController } from './news-sync.controller';

@Module({
  imports: [HttpModule, PrismaModule],
  providers: [NewsSyncService],
  controllers: [NewsSyncController],
})
export class NewsSyncModule {}
