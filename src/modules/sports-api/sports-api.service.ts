import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface LiveMatchData {
  elapsed: number | null;
  statusShort: string;
  statusLong: string;
  score: { home: number | null; away: number | null };
  events: Array<{
    elapsed: number;
    extraTime: number | null;
    type: string;
    detail: string;
    teamName: string;
    playerName: string;
  }>;
  stats: {
    home: { possession: string | null; shotsOnGoal: number | null; corners: number | null };
    away: { possession: string | null; shotsOnGoal: number | null; corners: number | null };
  } | null;
}

export interface EspnMatch {
  id: string;
  datetime: string;     // Full ISO "2026-06-12T19:00Z"
  date: string;         // YYYY-MM-DD
  homeName: string;
  awayName: string;
  homeScore: number | null;
  awayScore: number | null;
  statusName: string;   // e.g. STATUS_IN_PROGRESS
  status: string;       // mapped: LIVE / HT / UPCOMING / FINISHED
  clock: number | null; // elapsed seconds
  displayClock: string | null; // "73'"
}

// ESPN status name → our MatchStatus
const ESPN_STATUS_MAP: Record<string, string> = {
  STATUS_SCHEDULED: 'UPCOMING',
  STATUS_IN_PROGRESS: 'LIVE',
  STATUS_HALFTIME: 'HT',
  STATUS_END_PERIOD: 'LIVE',
  STATUS_FINAL: 'FINISHED',
  STATUS_FULL_TIME: 'FINISHED',
  STATUS_POSTPONED: 'POSTPONED',
  STATUS_CANCELED: 'CANCELLED',
  STATUS_CANCELLED: 'CANCELLED',
  STATUS_SUSPENDED: 'LIVE',
};

const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world';

@Injectable()
export class SportsApiService {
  private readonly logger = new Logger(SportsApiService.name);

  constructor(private readonly http: HttpService) {}

  // ─── Internal: call ESPN scoreboard for a specific date (YYYYMMDD) ────────

  private async fetchScoreboard(date?: string): Promise<any[]> {
    try {
      const params: any = {};
      if (date) params.dates = date;
      const res = await firstValueFrom(
        this.http.get(`${ESPN_BASE}/scoreboard`, { params }),
      );
      return res.data?.events || [];
    } catch (e: any) {
      this.logger.error(`ESPN scoreboard error (date=${date ?? 'today'}): ${e.message}`);
      return [];
    }
  }

  // ─── Parse an ESPN event into EspnMatch ──────────────────────────────────

  private parseEvent(event: any): EspnMatch {
    const comp = event.competitions?.[0];
    const home = comp?.competitors?.find((c: any) => c.homeAway === 'home');
    const away = comp?.competitors?.find((c: any) => c.homeAway === 'away');
    const statusName: string = comp?.status?.type?.name || 'STATUS_SCHEDULED';

    const rawDate: string = event.date || '';
    return {
      id: String(event.id),
      datetime: rawDate,
      date: rawDate.split('T')[0], // YYYY-MM-DD UTC
      homeName: home?.team?.displayName || home?.team?.name || '',
      awayName: away?.team?.displayName || away?.team?.name || '',
      homeScore: home?.score != null ? Number(home.score) : null,
      awayScore: away?.score != null ? Number(away.score) : null,
      statusName,
      status: ESPN_STATUS_MAP[statusName] || 'UPCOMING',
      clock: comp?.status?.clock ?? null,
      displayClock: comp?.status?.displayClock ?? null,
    };
  }

  // ─── Get all WC matches for a list of UTC dates (YYYY-MM-DD) ─────────────

  async getMatchesForDates(dates: string[]): Promise<EspnMatch[]> {
    const uniqueDates = [...new Set(dates)];
    const results: EspnMatch[] = [];

    for (const date of uniqueDates) {
      const espnDate = date.replace(/-/g, ''); // YYYYMMDD
      const events = await this.fetchScoreboard(espnDate);
      results.push(...events.map((e) => this.parseEvent(e)));
      // Small delay to be respectful; ESPN has no hard rate limit
      await new Promise((r) => setTimeout(r, 80));
    }

    return results;
  }

  // ─── Get currently live WC matches (today's scoreboard) ──────────────────

  async getLiveWcMatches(): Promise<EspnMatch[]> {
    const events = await this.fetchScoreboard(); // no date = today
    return events
      .map((e) => this.parseEvent(e))
      .filter((e) => e.status === 'LIVE' || e.status === 'HT');
  }

  // ─── Get one match summary by ESPN event ID ───────────────────────────────

  async getMatch(espnEventId: string): Promise<any | null> {
    try {
      const res = await firstValueFrom(
        this.http.get(`${ESPN_BASE}/summary`, { params: { event: espnEventId } }),
      );
      return res.data || null;
    } catch (e: any) {
      this.logger.error(`ESPN summary error (event=${espnEventId}): ${e.message}`);
      return null;
    }
  }

  // ─── Test connection ──────────────────────────────────────────────────────

  async testConnection(): Promise<{
    connected: boolean;
    source: string;
    todayMatches: number;
    error: string | null;
    sample: Pick<EspnMatch, 'id' | 'date' | 'homeName' | 'awayName' | 'status'>[];
  }> {
    const events = await this.fetchScoreboard();
    const parsed = events.map((e) => this.parseEvent(e));
    return {
      connected: true,
      source: 'ESPN (no API key required)',
      todayMatches: parsed.length,
      error: null,
      sample: parsed.slice(0, 5).map(({ id, date, homeName, awayName, status }) => ({ id, date, homeName, awayName, status })),
    };
  }

  // ─── Map ESPN status name to our MatchStatus ──────────────────────────────

  mapStatus(espnStatusName: string): string {
    return ESPN_STATUS_MAP[espnStatusName] || 'UPCOMING';
  }

  // ─── Transform ESPN summary into LiveMatchData for the match page ─────────

  transformMatch(summary: any): LiveMatchData {
    const comp = summary.header?.competitions?.[0];
    const home = comp?.competitors?.find((c: any) => c.homeAway === 'home');
    const away = comp?.competitors?.find((c: any) => c.homeAway === 'away');
    const statusName: string = comp?.status?.type?.name || 'STATUS_SCHEDULED';
    const displayClock: string = comp?.status?.displayClock || '';
    const elapsed = displayClock ? (parseInt(displayClock.split(':')[0], 10) || null) : null;

    return {
      elapsed,
      statusShort: statusName,
      statusLong: comp?.status?.type?.description || this.mapStatus(statusName),
      score: {
        home: home?.score != null ? Number(home.score) : null,
        away: away?.score != null ? Number(away.score) : null,
      },
      events: [],
      stats: null,
    };
  }
}
