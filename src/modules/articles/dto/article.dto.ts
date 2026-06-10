import {
  IsString, IsOptional, IsBoolean, IsInt,
  IsEnum, IsArray, IsDateString,
} from 'class-validator';
import { ArticleStatus } from '@prisma/client';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  featuredImage?: string;

  @IsString()
  categoryId: string;

  @IsEnum(ArticleStatus)
  @IsOptional()
  status?: ArticleStatus;

  @IsBoolean()
  @IsOptional()
  isBreaking?: boolean;

  @IsBoolean()
  @IsOptional()
  isTrending?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsInt()
  @IsOptional()
  readTime?: number;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;
}

export class UpdateArticleDto extends CreateArticleDto {}

export class ArticleQueryDto {
  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;

  @IsOptional()
  category?: string;

  @IsOptional()
  status?: ArticleStatus;

  @IsOptional()
  search?: string;
}
