import { Module } from '@nestjs/common';
import { AdvertisementsService } from './advertisements.service';
import { AdvertisementsController } from './advertisements.controller';

@Module({
  providers: [AdvertisementsService],
  controllers: [AdvertisementsController],
  exports: [AdvertisementsService],
})
export class AdvertisementsModule {}
