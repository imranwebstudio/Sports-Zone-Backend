import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdvertisementsService, CreateAdDto } from './advertisements.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdSlot } from '@prisma/client';

@ApiTags('Advertisements')
@Controller('advertisements')
export class AdvertisementsController {
  constructor(private readonly svc: AdvertisementsService) {}

  @Get('active')
  findActive(@Query('page') page?: string) { return this.svc.findActive(page); }

  @Get('slot/:slot')
  findBySlot(@Param('slot') slot: AdSlot) { return this.svc.findBySlot(slot); }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll() { return this.svc.findAll(); }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() dto: CreateAdDto) { return this.svc.create(dto); }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  toggle(@Param('id') id: string) { return this.svc.toggle(id); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: Partial<CreateAdDto>) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
