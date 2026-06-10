import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly svc: AnalyticsService) {}

  @Post('track')
  track(@Body() body: { path: string; referrer?: string }) {
    return this.svc.trackPageView(body);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getDashboard() { return this.svc.getDashboardStats(); }

  @Get('views')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getViews(@Query('days') days: string) {
    return this.svc.getViewsOverTime(days ? parseInt(days) : 7);
  }
}
