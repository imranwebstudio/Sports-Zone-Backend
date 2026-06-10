import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export class CreateChannelDto {
  matchId: string;
  name: string;
  language?: string;
  logo?: string;
  thumbnail?: string;
  destinationUrl: string;
  isActive?: boolean;
  sortOrder?: number;
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
