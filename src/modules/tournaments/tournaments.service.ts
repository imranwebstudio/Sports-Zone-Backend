import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export class CreateTournamentDto {
  name: string;
  slug: string;
  logo?: string;
  country?: string;
  sport?: string;
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
