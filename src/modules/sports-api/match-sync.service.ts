import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { SportsApiService } from './sports-api.service';

@Injectable()
export class MatchSyncService {
  private readonly logger = new Logger(MatchSyncService.name);

  private readonly ALIASES: Record<string, string[]> = {
    'united states': ['usa', 'us', 'united states of america'],
    'usa': ['united states', 'us'],
    'south korea': ['korea republic', 'republic of korea', 'korea'],
    'korea republic': ['south korea', 'korea'],
    'north korea': ['korea dpr', 'dpr korea'],
    'iran': ['ir iran', 'islamic republic of iran'],
    'ivory coast': ["cote d'ivoire", 'cote divoire'],
    "cote d'ivoire": ['ivory coast'],
    'czech republic': ['czechia'],
    'czechia': ['czech republic'],
    'trinidad & tobago': ['trinidad and tobago'],
    'trinidad and tobago': ['trinidad & tobago'],
    'saudi arabia': ['ksa'],
    'new zealand': ['nz', 'all whites'],
    'dr congo': ['congo dr', 'democratic republic of congo'],
    // ESPN-specific normalizations
    'bosnia and herzegovina': ['bosniaherzegovina', 'bosnia-herzegovina', 'bih'],
    'bosniaherzegovina': ['bosnia and herzegovina', 'bih'],
    'democratic republic of the congo': ['dr congo', 'congo dr'],
    'republic of ireland': ['ireland'],
    'ireland': ['republic of ireland'],
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly sportsApi: SportsApiService,
  ) {}

  // ─── Team name normalization + matching ───────────────────────────────────

  private norm(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[^a-z0-9 ]/g, '')
      .trim();
  }

  private teamsMatch(dbName: string, apiName: string): boolean {
    const db = this.norm(dbName);
    const api = this.norm(apiName);
    if (db === api || api.includes(db) || db.includes(api)) return true;
    return (this.ALIASES[db] || []).some((a) => {
      const n = this.norm(a);
      return api === n || api.includes(n) || n.includes(api);
    });
  }

  // ─── Cron: live score sync every 60 s ────────────────────────────────────

  @Cron('*/60 * * * * *')
  async syncLiveScores() {
    const tracked = await this.prisma.match.findMany({
      where: { externalId: { not: null }, status: { in: ['UPCOMING', 'LIVE', 'HT'] } },
      select: { id: true, externalId: true },
    });
    if (!tracked.length) return;

    const liveMatches = await this.sportsApi.getLiveWcMatches();
    if (!liveMatches.length) return;

    const idMap = new Map(tracked.map((m) => [m.externalId!, m.id]));
    let updated = 0;

    for (const espnMatch of liveMatches) {
      const matchId = idMap.get(espnMatch.id);
      if (!matchId) continue;

      // Compute elapsed minutes from ESPN displayClock ("73:00" → 73)
      let minute: number | undefined;
      if (espnMatch.displayClock) {
        const mins = parseInt(espnMatch.displayClock.split(':')[0], 10);
        if (!isNaN(mins)) minute = mins;
      }

      await this.prisma.match.update({
        where: { id: matchId },
        data: {
          status: espnMatch.status as any,
          homeScore: espnMatch.homeScore ?? undefined,
          awayScore: espnMatch.awayScore ?? undefined,
          minute: minute ?? undefined,
        },
      });
      updated++;
    }

    if (updated > 0) this.logger.log(`Live sync: updated ${updated} matches`);
  }

  // ─── Cron: time-based status fallback every 5 min ────────────────────────

  @Cron('*/5 * * * *')
  async syncStatusByTime() {
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    const [started, finished] = await Promise.all([
      this.prisma.match.updateMany({
        where: { status: 'UPCOMING', matchTime: { lte: now }, externalId: null },
        data: { status: 'LIVE' },
      }),
      this.prisma.match.updateMany({
        where: { status: { in: ['LIVE', 'HT'] }, matchTime: { lte: twoHoursAgo }, externalId: null },
        data: { status: 'FINISHED' },
      }),
    ]);

    if (started.count + finished.count > 0)
      this.logger.log(`Time-based: ${started.count} → LIVE, ${finished.count} → FINISHED`);
  }

  // ─── Cron: daily auto-link at 4 AM ───────────────────────────────────────

  @Cron('0 4 * * *')
  async dailyAutoLink() {
    const r = await this.autoLinkFixtures();
    this.logger.log(`Daily auto-link: ${r.linked}/${r.total}`);
  }

  // ─── Generate date strings YYYY-MM-DD between two dates ─────────────────

  private dateRange(from: string, to: string): string[] {
    const dates: string[] = [];
    const cur = new Date(from + 'T00:00Z');
    const end = new Date(to + 'T00:00Z');
    while (cur <= end) {
      dates.push(cur.toISOString().split('T')[0]);
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
    return dates;
  }

  // ─── Find a team in a list using fuzzy matching ───────────────────────────

  private findTeamInList(teams: { id: string; name: string; slug: string }[], espnName: string) {
    return teams.find((t) => this.teamsMatch(t.name, espnName)) || null;
  }

  // ─── Import real WC schedule from ESPN, creating missing matches ──────────

  async importRealSchedule(): Promise<{
    created: number;
    updated: number;
    skipped: number;
    total: number;
    missingTeams: string[];
    error: string | null;
  }> {
    // Get WC tournament from DB
    const tournament = await this.prisma.tournament.findFirst({
      where: { name: { contains: 'World Cup' } },
    });
    if (!tournament) {
      return { created: 0, updated: 0, skipped: 0, total: 0, missingTeams: [], error: 'World Cup tournament not found in DB' };
    }

    // Fetch all ESPN matches for WC 2026 group + knockout dates
    const dates = this.dateRange('2026-06-11', '2026-07-19');
    this.logger.log(`Fetching ESPN schedule for ${dates.length} dates…`);
    const espnMatches = await this.sportsApi.getMatchesForDates(dates);
    this.logger.log(`ESPN returned ${espnMatches.length} total WC events`);

    if (!espnMatches.length) {
      return { created: 0, updated: 0, skipped: 0, total: 0, missingTeams: [], error: 'ESPN returned no events' };
    }

    // Load all DB teams once
    const dbTeams = await this.prisma.team.findMany({ select: { id: true, name: true, slug: true } });

    let created = 0, updated = 0, skipped = 0;
    const missingTeams = new Set<string>();

    for (const em of espnMatches) {
      const homeTeam = this.findTeamInList(dbTeams, em.homeName);
      const awayTeam = this.findTeamInList(dbTeams, em.awayName);

      if (!homeTeam || !awayTeam) {
        if (!homeTeam) missingTeams.add(em.homeName);
        if (!awayTeam) missingTeams.add(em.awayName);
        skipped++;
        continue;
      }

      const matchTime = new Date(em.datetime || em.date);
      const dayStart = new Date(matchTime); dayStart.setUTCHours(0, 0, 0, 0);
      const dayEnd = new Date(matchTime); dayEnd.setUTCHours(23, 59, 59, 999);

      // Look for an existing match: by externalId first, then by teams+day
      const existing = await this.prisma.match.findFirst({
        where: {
          OR: [
            { externalId: em.id },
            {
              homeTeamId: homeTeam.id,
              awayTeamId: awayTeam.id,
              matchTime: { gte: dayStart, lte: dayEnd },
            },
          ],
        },
      });

      if (existing) {
        await this.prisma.match.update({
          where: { id: existing.id },
          data: { externalId: em.id, matchTime, status: em.status as any },
        });
        this.logger.log(`Updated ${homeTeam.name} vs ${awayTeam.name} → ESPN#${em.id}`);
        updated++;
      } else {
        const dateStr = em.date;
        const slug = `${homeTeam.slug}-vs-${awayTeam.slug}-${dateStr}`;
        await this.prisma.match.create({
          data: {
            title: `${homeTeam.name} vs ${awayTeam.name}`,
            homeTeamId: homeTeam.id,
            awayTeamId: awayTeam.id,
            tournamentId: tournament.id,
            matchTime,
            externalId: em.id,
            status: em.status as any,
            slug,
            isActive: true,
          },
        });
        this.logger.log(`Created ${homeTeam.name} vs ${awayTeam.name} → ESPN#${em.id}`);
        created++;
      }
    }

    return { created, updated, skipped, total: espnMatches.length, missingTeams: [...missingTeams], error: null };
  }

  // ─── Auto-link: match DB entries to ESPN event IDs ───────────────────────

  async autoLinkFixtures(): Promise<{
    linked: number;
    total: number;
    notFound: string[];
    error: string | null;
  }> {
    const unlinked = await this.prisma.match.findMany({
      where: { externalId: null, isActive: true },
      include: { homeTeam: { select: { name: true } }, awayTeam: { select: { name: true } } },
      orderBy: { matchTime: 'asc' },
    });

    if (!unlinked.length) return { linked: 0, total: 0, notFound: [], error: null };
    this.logger.log(`Auto-link: ${unlinked.length} unlinked matches`);

    // Collect unique UTC dates (and ±1 day for timezone edge cases)
    const dateSet = new Set<string>();
    for (const match of unlinked) {
      const base = match.matchTime.toISOString().split('T')[0];
      dateSet.add(base);
      dateSet.add(new Date(match.matchTime.getTime() - 864e5).toISOString().split('T')[0]);
      dateSet.add(new Date(match.matchTime.getTime() + 864e5).toISOString().split('T')[0]);
    }

    // Fetch ESPN scoreboard data for all those dates
    const espnMatches = await this.sportsApi.getMatchesForDates([...dateSet]);
    if (!espnMatches.length) {
      return { linked: 0, total: unlinked.length, notFound: [], error: 'ESPN returned 0 WC matches for these dates' };
    }

    this.logger.log(`ESPN returned ${espnMatches.length} WC fixtures across ${dateSet.size} dates`);
    const sample = espnMatches.slice(0, 3).map((f) => `${f.homeName} vs ${f.awayName} (${f.date})`);
    this.logger.log(`Sample: ${sample.join(' | ')}`);

    let linked = 0;
    const notFound: string[] = [];

    for (const match of unlinked) {
      const utcDate = match.matchTime.toISOString().split('T')[0];
      const altDates = [
        utcDate,
        new Date(match.matchTime.getTime() - 864e5).toISOString().split('T')[0],
        new Date(match.matchTime.getTime() + 864e5).toISOString().split('T')[0],
      ];

      const espnMatch = espnMatches.find((f) =>
        altDates.includes(f.date) &&
        this.teamsMatch(match.homeTeam.name, f.homeName) &&
        this.teamsMatch(match.awayTeam.name, f.awayName),
      );

      if (espnMatch) {
        await this.prisma.match.update({ where: { id: match.id }, data: { externalId: espnMatch.id } });
        this.logger.log(`✓ ${match.homeTeam.name} vs ${match.awayTeam.name} → ESPN#${espnMatch.id}`);
        linked++;
      } else {
        this.logger.warn(`✗ ${match.homeTeam.name} vs ${match.awayTeam.name} (${utcDate})`);
        notFound.push(`${match.homeTeam.name} vs ${match.awayTeam.name}`);
      }
    }

    return { linked, total: unlinked.length, notFound, error: null };
  }
}
