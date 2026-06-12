import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SportsApiService, LiveMatchData } from '../sports-api/sports-api.service';
import { CreateMatchDto, UpdateMatchDto, MatchQueryDto } from './dto/match.dto';

const INCLUDE = {
  homeTeam: { select: { id: true, name: true, logo: true, country: true } },
  awayTeam: { select: { id: true, name: true, logo: true, country: true } },
  tournament: { select: { id: true, name: true, logo: true } },
  channels: {
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' as const },
  },
};

@Injectable()
export class MatchesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sportsApi: SportsApiService,
  ) {}

  async findAll(query: MatchQueryDto) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;
    const where: any = { isActive: true };
    if (query.status) where.status = query.status;
    if (query.tournamentId) where.tournamentId = query.tournamentId;

    const [total, items] = await Promise.all([
      this.prisma.match.count({ where }),
      this.prisma.match.findMany({
        where, skip, take: limit,
        orderBy: [{ status: 'asc' }, { matchTime: 'asc' }],
        include: INCLUDE,
      }),
    ]);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findLive() {
    return this.prisma.match.findMany({
      where: { status: { in: ['LIVE', 'HT'] }, isActive: true },
      orderBy: { matchTime: 'asc' },
      include: INCLUDE,
    });
  }

  async findFeatured() {
    return this.prisma.match.findMany({
      where: { isFeatured: true, isActive: true },
      orderBy: [{ status: 'asc' }, { matchTime: 'asc' }],
      include: INCLUDE,
    });
  }

  async findOne(slug: string) {
    const match = await this.prisma.match.findUnique({ where: { slug }, include: INCLUDE });
    if (!match) throw new NotFoundException('Match not found');
    await this.prisma.match.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });
    return match;
  }

  async getLiveData(slug: string) {
    const match = await this.prisma.match.findUnique({ where: { slug }, include: INCLUDE });
    if (!match) throw new NotFoundException('Match not found');

    let liveData: LiveMatchData | null = null;
    if (match.externalId) {
      const fdMatch = await this.sportsApi.getMatch(match.externalId);
      if (fdMatch) {
        liveData = this.sportsApi.transformMatch(fdMatch);
      }
    }

    return { ...match, liveData };
  }

  async create(dto: CreateMatchDto) {
    return this.prisma.match.create({
      data: { ...dto, matchTime: new Date(dto.matchTime) },
      include: INCLUDE,
    });
  }

  async update(id: string, dto: UpdateMatchDto) {
    await this.prisma.match.findUniqueOrThrow({ where: { id } });
    return this.prisma.match.update({
      where: { id },
      data: { ...dto, matchTime: dto.matchTime ? new Date(dto.matchTime) : undefined },
      include: INCLUDE,
    });
  }

  async remove(id: string) {
    await this.prisma.match.findUniqueOrThrow({ where: { id } });
    return this.prisma.match.delete({ where: { id } });
  }

  async getStats() {
    const [total, live, upcoming, finished] = await Promise.all([
      this.prisma.match.count(),
      this.prisma.match.count({ where: { status: 'LIVE' } }),
      this.prisma.match.count({ where: { status: 'UPCOMING' } }),
      this.prisma.match.count({ where: { status: 'FINISHED' } }),
    ]);
    return { total, live, upcoming, finished };
  }
}
