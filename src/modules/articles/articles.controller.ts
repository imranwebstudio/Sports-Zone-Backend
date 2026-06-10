import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto, ArticleQueryDto } from './dto/article.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly svc: ArticlesService) {}

  @Get()
  findAll(@Query() query: ArticleQueryDto) {
    return this.svc.findAll(query);
  }

  @Get('trending')
  findTrending(@Query('limit') limit: string) {
    return this.svc.findTrending(limit ? parseInt(limit) : 6);
  }

  @Get('breaking')
  findBreaking(@Query('limit') limit: string) {
    return this.svc.findBreaking(limit ? parseInt(limit) : 5);
  }

  @Get('featured')
  findFeatured(@Query('limit') limit: string) {
    return this.svc.findFeatured(limit ? parseInt(limit) : 4);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getStats() { return this.svc.getStats(); }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAllAdmin(@Query() query: ArticleQueryDto) {
    return this.svc.findAll(query, true);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.svc.findOne(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() dto: CreateArticleDto, @Request() req: any) {
    return this.svc.create(dto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
