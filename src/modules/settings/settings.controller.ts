import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Settings')
@Controller('settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SettingsController {
  constructor(private readonly svc: SettingsService) {}

  @Get() findAll() { return this.svc.findAll(); }

  @Get(':key') get(@Param('key') key: string) { return this.svc.get(key); }

  @Post()
  set(@Body() body: { key: string; value: string; group?: string }) {
    return this.svc.set(body.key, body.value, body.group);
  }

  @Post('bulk')
  setMany(@Body() body: { key: string; value: string; group?: string }[]) {
    return this.svc.setMany(body);
  }
}
