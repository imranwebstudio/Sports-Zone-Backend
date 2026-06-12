import { Injectable } from '@nestjs/common';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { PrismaService } from '../../prisma/prisma.service';

export class CreateTournamentDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  sport?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

@Injectable()
export class TournamentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.tournament.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { matches: true } } },
    });
  }

  findOne(id: string) {
    return this.prisma.tournament.findUniqueOrThrow({ where: { id } });
  }

  create(dto: CreateTournamentDto) {
    return this.prisma.tournament.create({ data: dto });
  }

  async update(id: string, dto: Partial<CreateTournamentDto> & { isActive?: boolean }) {
    await this.prisma.tournament.findUniqueOrThrow({ where: { id } });
    return this.prisma.tournament.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.tournament.findUniqueOrThrow({ where: { id } });
    return this.prisma.tournament.delete({ where: { id } });
  }
}
