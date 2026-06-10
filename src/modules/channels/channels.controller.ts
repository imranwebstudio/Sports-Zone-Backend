import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ChannelsService, CreateChannelDto } from './channels.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Channels')
@Controller('channels')
export class ChannelsController {
  constructor(private readonly svc: ChannelsService) {}

  @Get('match/:matchId')
  findByMatch(@Param('matchId') matchId: string) {
    return this.svc.findByMatch(matchId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() dto: CreateChannelDto) { return this.svc.create(dto); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: Partial<CreateChannelDto>) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
