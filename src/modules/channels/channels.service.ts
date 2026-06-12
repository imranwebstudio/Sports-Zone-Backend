import { Injectable } from '@nestjs/common';
import { IsString, IsOptional, IsBoolean, IsInt, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PrismaService } from '../../prisma/prisma.service';

export class CreateChannelDto {
  @IsUUID() matchId: string;
  @IsString() name: string;
  @IsOptional() @IsString() language?: string;
  @IsOptional() @IsString() logo?: string;
  @IsOptional() @IsString() thumbnail?: string;
  @IsString() destinationUrl: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsInt() @Type(() => Number) sortOrder?: number;
}

@Injectable()
export class ChannelsService {
  constructor(private readonly prisma: PrismaService) {}

  findByMatch(matchId: string) {
    return this.prisma.channel.findMany({
      where: { matchId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(dto: CreateChannelDto) {
    return this.prisma.channel.create({ data: dto });
  }

  async update(id: string, dto: Partial<CreateChannelDto>) {
    await this.prisma.channel.findUniqueOrThrow({ where: { id } });
    return this.prisma.channel.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.channel.findUniqueOrThrow({ where: { id } });
    return this.prisma.channel.delete({ where: { id } });
  }
}
