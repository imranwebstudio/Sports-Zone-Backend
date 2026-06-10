import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { CreateMatchDto, UpdateMatchDto, MatchQueryDto } from './dto/match.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly svc: MatchesService) {}

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
