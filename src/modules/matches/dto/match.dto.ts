import {
  IsString, IsOptional, IsBoolean, IsInt,
  IsEnum, IsDateString,
} from 'class-validator';
import { MatchStatus, DestinationType } from '@prisma/client';

export class CreateMatchDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  homeTeamId: string;

  @IsString()
  awayTeamId: string;

  @IsString()
  tournamentId: string;

  @IsDateString()
  matchTime: string;

  @IsEnum(MatchStatus)
  @IsOptional()
  status?: MatchStatus;

  @IsInt()
  @IsOptional()
  homeScore?: number;

  @IsInt()
  @IsOptional()
  awayScore?: number;

  @IsInt()
  @IsOptional()
  minute?: number;

  @IsString()
  @IsOptional()
  banner?: string;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsEnum(DestinationType)
  @IsOptional()
  destinationType?: DestinationType;

  @IsString()
  @IsOptional()
  externalUrl?: string;

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsString()
  @IsOptional()
  externalId?: string;
}

export class UpdateMatchDto extends CreateMatchDto {}

export class MatchQueryDto {
  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;

  @IsOptional()
  status?: MatchStatus;

  @IsOptional()
  tournamentId?: string;
}
