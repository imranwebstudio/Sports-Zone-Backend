/**
 * WC 2026 CORRECT SEED
 * Uses the real FIFA World Cup 2026 draw (48 teams, 12 groups A–L).
 * Run: npx tsx prisma/seed-wc2026-correct.ts
 *
 * - Clears all existing WC group-stage matches
 * - Upserts the 48 correct national teams
 * - Creates all 72 group-stage matches with UTC kick-off times
 *   (kickoff_et times are in EDT = UTC-4)
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL!) });

// ─── helpers ────────────────────────────────────────────────────────────────

const flag = (code: string) => `https://flagcdn.com/w160/${code}.png`;
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Convert EDT (UTC-4) kickoff to UTC Date. Handles next-day rollover. */
function edtToUtc(date: string, kickoffEdt: string | null): Date {
  if (!kickoffEdt) return new Date(`${date}T20:00:00Z`); // default 4 PM EDT

  const m = kickoffEdt.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!m) return new Date(`${date}T20:00:00Z`);

  let h = parseInt(m[1]);
  const min = parseInt(m[2]);
  const period = m[3].toUpperCase();

  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;

  // EDT = UTC-4; UTC = EDT + 4
  let utcH = h + 4;
  let utcDate = date;

  if (utcH >= 24) {
    utcH -= 24;
    const d = new Date(`${date}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    utcDate = d.toISOString().split('T')[0];
  }

  return new Date(
    `${utcDate}T${String(utcH).padStart(2, '0')}:${String(min).padStart(2, '0')}:00Z`,
  );
}

// ─── 48 correct national teams ───────────────────────────────────────────────

const TEAMS = [
  // Group A
  { name: 'Mexico',               slug: 'mexico',               country: 'Mexico',               logo: flag('mx') },
  { name: 'South Africa',         slug: 'south-africa',         country: 'South Africa',         logo: flag('za') },
  { name: 'South Korea',          slug: 'south-korea',          country: 'South Korea',          logo: flag('kr') },
  { name: 'Czechia',              slug: 'czechia',              country: 'Czechia',              logo: flag('cz') },
  // Group B
  { name: 'Canada',               slug: 'canada',               country: 'Canada',               logo: flag('ca') },
  { name: 'Bosnia and Herzegovina', slug: 'bosnia-and-herzegovina', country: 'Bosnia and Herzegovina', logo: flag('ba') },
  { name: 'Qatar',                slug: 'qatar',                country: 'Qatar',                logo: flag('qa') },
  { name: 'Switzerland',          slug: 'switzerland',          country: 'Switzerland',          logo: flag('ch') },
  // Group C
  { name: 'Brazil',               slug: 'brazil',               country: 'Brazil',               logo: flag('br') },
  { name: 'Morocco',              slug: 'morocco',              country: 'Morocco',              logo: flag('ma') },
  { name: 'Haiti',                slug: 'haiti',                country: 'Haiti',                logo: flag('ht') },
  { name: 'Scotland',             slug: 'scotland',             country: 'Scotland',             logo: flag('gb-sct') },
  // Group D
  { name: 'United States',        slug: 'usa',                  country: 'USA',                  logo: flag('us') },
  { name: 'Paraguay',             slug: 'paraguay',             country: 'Paraguay',             logo: flag('py') },
  { name: 'Australia',            slug: 'australia',            country: 'Australia',            logo: flag('au') },
  { name: 'Turkey',               slug: 'turkey',               country: 'Turkey',               logo: flag('tr') },
  // Group E
  { name: 'Germany',              slug: 'germany',              country: 'Germany',              logo: flag('de') },
  { name: 'Curacao',              slug: 'curacao',              country: 'Curacao',              logo: flag('cw') },
  { name: 'Ivory Coast',          slug: 'ivory-coast',          country: 'Ivory Coast',          logo: flag('ci') },
  { name: 'Ecuador',              slug: 'ecuador',              country: 'Ecuador',              logo: flag('ec') },
  // Group F
  { name: 'Netherlands',          slug: 'netherlands',          country: 'Netherlands',          logo: flag('nl') },
  { name: 'Japan',                slug: 'japan',                country: 'Japan',                logo: flag('jp') },
  { name: 'Sweden',               slug: 'sweden',               country: 'Sweden',               logo: flag('se') },
  { name: 'Tunisia',              slug: 'tunisia',              country: 'Tunisia',              logo: flag('tn') },
  // Group G
  { name: 'Iran',                 slug: 'iran',                 country: 'Iran',                 logo: flag('ir') },
  { name: 'New Zealand',          slug: 'new-zealand',          country: 'New Zealand',          logo: flag('nz') },
  { name: 'Belgium',              slug: 'belgium',              country: 'Belgium',              logo: flag('be') },
  { name: 'Egypt',                slug: 'egypt',                country: 'Egypt',                logo: flag('eg') },
  // Group H
  { name: 'Spain',                slug: 'spain',                country: 'Spain',                logo: flag('es') },
  { name: 'Cape Verde',           slug: 'cape-verde',           country: 'Cape Verde',           logo: flag('cv') },
  { name: 'Saudi Arabia',         slug: 'saudi-arabia',         country: 'Saudi Arabia',         logo: flag('sa') },
  { name: 'Uruguay',              slug: 'uruguay',              country: 'Uruguay',              logo: flag('uy') },
  // Group I
  { name: 'France',               slug: 'france',               country: 'France',               logo: flag('fr') },
  { name: 'Senegal',              slug: 'senegal',              country: 'Senegal',              logo: flag('sn') },
  { name: 'Iraq',                 slug: 'iraq',                 country: 'Iraq',                 logo: flag('iq') },
  { name: 'Norway',               slug: 'norway',               country: 'Norway',               logo: flag('no') },
  // Group J
  { name: 'Argentina',            slug: 'argentina',            country: 'Argentina',            logo: flag('ar') },
  { name: 'Algeria',              slug: 'algeria',              country: 'Algeria',              logo: flag('dz') },
  { name: 'Austria',              slug: 'austria',              country: 'Austria',              logo: flag('at') },
  { name: 'Jordan',               slug: 'jordan',               country: 'Jordan',               logo: flag('jo') },
  // Group K
  { name: 'Portugal',             slug: 'portugal',             country: 'Portugal',             logo: flag('pt') },
  { name: 'DR Congo',             slug: 'dr-congo',             country: 'DR Congo',             logo: flag('cd') },
  { name: 'Uzbekistan',           slug: 'uzbekistan',           country: 'Uzbekistan',           logo: flag('uz') },
  { name: 'Colombia',             slug: 'colombia',             country: 'Colombia',             logo: flag('co') },
  // Group L
  { name: 'England',              slug: 'england',              country: 'England',              logo: flag('gb-eng') },
  { name: 'Croatia',              slug: 'croatia',              country: 'Croatia',              logo: flag('hr') },
  { name: 'Ghana',                slug: 'ghana',                country: 'Ghana',                logo: flag('gh') },
  { name: 'Panama',               slug: 'panama',               country: 'Panama',               logo: flag('pa') },
] as const;

// ─── 72 group-stage fixtures (kickoff_et in EDT = UTC-4) ────────────────────

interface FixtureRow {
  home: string; away: string; date: string;
  et: string | null; score: string | null; group: string;
}

const FIXTURES: FixtureRow[] = [
  // ── GROUP A ─────────────────────────────────────────────────────────────
  { home: 'Mexico',               away: 'South Africa',         date: '2026-06-11', et: null,         score: '2-0', group: 'A' },
  { home: 'South Korea',          away: 'Czechia',              date: '2026-06-11', et: null,         score: '2-1', group: 'A' },
  { home: 'Czechia',              away: 'South Africa',         date: '2026-06-18', et: '12:00 PM',   score: null,  group: 'A' },
  { home: 'Mexico',               away: 'South Korea',          date: '2026-06-18', et: '9:00 PM',    score: null,  group: 'A' },
  { home: 'Czechia',              away: 'Mexico',               date: '2026-06-24', et: '9:00 PM',    score: null,  group: 'A' },
  { home: 'South Africa',         away: 'South Korea',          date: '2026-06-24', et: '9:00 PM',    score: null,  group: 'A' },

  // ── GROUP B ─────────────────────────────────────────────────────────────
  { home: 'Canada',               away: 'Bosnia and Herzegovina', date: '2026-06-12', et: '3:00 PM',  score: '1-1', group: 'B' },
  { home: 'Qatar',                away: 'Switzerland',          date: '2026-06-13', et: '3:00 PM',    score: null,  group: 'B' },
  { home: 'Switzerland',          away: 'Bosnia and Herzegovina', date: '2026-06-18', et: '3:00 PM',  score: null,  group: 'B' },
  { home: 'Canada',               away: 'Qatar',                date: '2026-06-18', et: '6:00 PM',    score: null,  group: 'B' },
  { home: 'Switzerland',          away: 'Canada',               date: '2026-06-24', et: '3:00 PM',    score: null,  group: 'B' },
  { home: 'Bosnia and Herzegovina', away: 'Qatar',              date: '2026-06-24', et: '3:00 PM',    score: null,  group: 'B' },

  // ── GROUP C ─────────────────────────────────────────────────────────────
  { home: 'Brazil',               away: 'Morocco',              date: '2026-06-13', et: '6:00 PM',    score: null,  group: 'C' },
  { home: 'Haiti',                away: 'Scotland',             date: '2026-06-13', et: '9:00 PM',    score: null,  group: 'C' },
  { home: 'Scotland',             away: 'Morocco',              date: '2026-06-19', et: '6:00 PM',    score: null,  group: 'C' },
  { home: 'Brazil',               away: 'Haiti',                date: '2026-06-19', et: '9:00 PM',    score: null,  group: 'C' },
  { home: 'Scotland',             away: 'Brazil',               date: '2026-06-24', et: '6:00 PM',    score: null,  group: 'C' },
  { home: 'Morocco',              away: 'Haiti',                date: '2026-06-24', et: '6:00 PM',    score: null,  group: 'C' },

  // ── GROUP D ─────────────────────────────────────────────────────────────
  { home: 'United States',        away: 'Paraguay',             date: '2026-06-12', et: '9:00 PM',    score: '4-1', group: 'D' },
  { home: 'Australia',            away: 'Turkey',               date: '2026-06-13', et: '12:00 AM',   score: null,  group: 'D' },
  { home: 'United States',        away: 'Australia',            date: '2026-06-19', et: '3:00 PM',    score: null,  group: 'D' },
  { home: 'Turkey',               away: 'Paraguay',             date: '2026-06-19', et: '12:00 AM',   score: null,  group: 'D' },
  { home: 'Turkey',               away: 'United States',        date: '2026-06-25', et: '10:00 PM',   score: null,  group: 'D' },
  { home: 'Paraguay',             away: 'Australia',            date: '2026-06-25', et: '10:00 PM',   score: null,  group: 'D' },

  // ── GROUP E ─────────────────────────────────────────────────────────────
  { home: 'Germany',              away: 'Curacao',              date: '2026-06-14', et: '1:00 PM',    score: null,  group: 'E' },
  { home: 'Ivory Coast',          away: 'Ecuador',              date: '2026-06-14', et: '7:00 PM',    score: null,  group: 'E' },
  { home: 'Germany',              away: 'Ivory Coast',          date: '2026-06-20', et: '4:00 PM',    score: null,  group: 'E' },
  { home: 'Ecuador',              away: 'Curacao',              date: '2026-06-20', et: '8:00 PM',    score: null,  group: 'E' },
  { home: 'Ecuador',              away: 'Germany',              date: '2026-06-25', et: '4:00 PM',    score: null,  group: 'E' },
  { home: 'Curacao',              away: 'Ivory Coast',          date: '2026-06-25', et: '4:00 PM',    score: null,  group: 'E' },

  // ── GROUP F ─────────────────────────────────────────────────────────────
  { home: 'Netherlands',          away: 'Japan',                date: '2026-06-14', et: '4:00 PM',    score: null,  group: 'F' },
  { home: 'Sweden',               away: 'Tunisia',              date: '2026-06-14', et: '10:00 PM',   score: null,  group: 'F' },
  { home: 'Netherlands',          away: 'Sweden',               date: '2026-06-20', et: '1:00 PM',    score: null,  group: 'F' },
  { home: 'Tunisia',              away: 'Japan',                date: '2026-06-20', et: '12:00 AM',   score: null,  group: 'F' },
  { home: 'Japan',                away: 'Sweden',               date: '2026-06-25', et: '7:00 PM',    score: null,  group: 'F' },
  { home: 'Tunisia',              away: 'Netherlands',          date: '2026-06-25', et: '7:00 PM',    score: null,  group: 'F' },

  // ── GROUP G ─────────────────────────────────────────────────────────────
  { home: 'Iran',                 away: 'New Zealand',          date: '2026-06-15', et: '9:00 PM',    score: null,  group: 'G' },
  { home: 'Belgium',              away: 'Egypt',                date: '2026-06-15', et: '3:00 PM',    score: null,  group: 'G' },
  { home: 'Belgium',              away: 'Iran',                 date: '2026-06-21', et: '3:00 PM',    score: null,  group: 'G' },
  { home: 'New Zealand',          away: 'Egypt',                date: '2026-06-21', et: '9:00 PM',    score: null,  group: 'G' },
  { home: 'Egypt',                away: 'Iran',                 date: '2026-06-26', et: '11:00 PM',   score: null,  group: 'G' },
  { home: 'New Zealand',          away: 'Belgium',              date: '2026-06-26', et: '11:00 PM',   score: null,  group: 'G' },

  // ── GROUP H ─────────────────────────────────────────────────────────────
  { home: 'Spain',                away: 'Cape Verde',           date: '2026-06-15', et: '12:00 PM',   score: null,  group: 'H' },
  { home: 'Saudi Arabia',         away: 'Uruguay',              date: '2026-06-15', et: '6:00 PM',    score: null,  group: 'H' },
  { home: 'Spain',                away: 'Saudi Arabia',         date: '2026-06-21', et: '12:00 PM',   score: null,  group: 'H' },
  { home: 'Uruguay',              away: 'Cape Verde',           date: '2026-06-21', et: '6:00 PM',    score: null,  group: 'H' },
  { home: 'Cape Verde',           away: 'Saudi Arabia',         date: '2026-06-26', et: '8:00 PM',    score: null,  group: 'H' },
  { home: 'Uruguay',              away: 'Spain',                date: '2026-06-26', et: '8:00 PM',    score: null,  group: 'H' },

  // ── GROUP I ─────────────────────────────────────────────────────────────
  { home: 'France',               away: 'Senegal',              date: '2026-06-16', et: '3:00 PM',    score: null,  group: 'I' },
  { home: 'Iraq',                 away: 'Norway',               date: '2026-06-16', et: '6:00 PM',    score: null,  group: 'I' },
  { home: 'France',               away: 'Iraq',                 date: '2026-06-22', et: '5:00 PM',    score: null,  group: 'I' },
  { home: 'Norway',               away: 'Senegal',              date: '2026-06-22', et: '8:00 PM',    score: null,  group: 'I' },
  { home: 'Norway',               away: 'France',               date: '2026-06-26', et: '3:00 PM',    score: null,  group: 'I' },
  { home: 'Senegal',              away: 'Iraq',                 date: '2026-06-26', et: '3:00 PM',    score: null,  group: 'I' },

  // ── GROUP J ─────────────────────────────────────────────────────────────
  { home: 'Argentina',            away: 'Algeria',              date: '2026-06-16', et: '9:00 PM',    score: null,  group: 'J' },
  { home: 'Austria',              away: 'Jordan',               date: '2026-06-16', et: '12:00 AM',   score: null,  group: 'J' },
  { home: 'Argentina',            away: 'Austria',              date: '2026-06-22', et: '1:00 PM',    score: null,  group: 'J' },
  { home: 'Jordan',               away: 'Algeria',              date: '2026-06-22', et: '11:00 PM',   score: null,  group: 'J' },
  { home: 'Algeria',              away: 'Austria',              date: '2026-06-27', et: '10:00 PM',   score: null,  group: 'J' },
  { home: 'Jordan',               away: 'Argentina',            date: '2026-06-27', et: '10:00 PM',   score: null,  group: 'J' },

  // ── GROUP K ─────────────────────────────────────────────────────────────
  { home: 'Portugal',             away: 'DR Congo',             date: '2026-06-17', et: '1:00 PM',    score: null,  group: 'K' },
  { home: 'Uzbekistan',           away: 'Colombia',             date: '2026-06-17', et: '10:00 PM',   score: null,  group: 'K' },
  { home: 'Portugal',             away: 'Uzbekistan',           date: '2026-06-23', et: '1:00 PM',    score: null,  group: 'K' },
  { home: 'Colombia',             away: 'DR Congo',             date: '2026-06-23', et: '10:00 PM',   score: null,  group: 'K' },
  { home: 'Colombia',             away: 'Portugal',             date: '2026-06-27', et: '7:30 PM',    score: null,  group: 'K' },
  { home: 'DR Congo',             away: 'Uzbekistan',           date: '2026-06-27', et: '7:30 PM',    score: null,  group: 'K' },

  // ── GROUP L ─────────────────────────────────────────────────────────────
  { home: 'England',              away: 'Croatia',              date: '2026-06-17', et: '4:00 PM',    score: null,  group: 'L' },
  { home: 'Ghana',                away: 'Panama',               date: '2026-06-17', et: '7:00 PM',    score: null,  group: 'L' },
  { home: 'England',              away: 'Ghana',                date: '2026-06-23', et: '4:00 PM',    score: null,  group: 'L' },
  { home: 'Panama',               away: 'Croatia',              date: '2026-06-23', et: '7:00 PM',    score: null,  group: 'L' },
  { home: 'Panama',               away: 'England',              date: '2026-06-27', et: '5:00 PM',    score: null,  group: 'L' },
  { home: 'Croatia',              away: 'Ghana',                date: '2026-06-27', et: '5:00 PM',    score: null,  group: 'L' },
];

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌍  WC 2026 Correct Seed – starting…\n');

  // 1. Find the World Cup tournament
  const tournament = await prisma.tournament.findFirst({
    where: { name: { contains: 'World Cup' } },
  });
  if (!tournament) {
    throw new Error('World Cup tournament not found. Run the main seed first.');
  }
  console.log(`✅  Tournament: ${tournament.name} (${tournament.id})`);

  // 2. Upsert all 48 teams (create if missing, update name/logo if changed)
  console.log('\n👕  Upserting 48 national teams…');
  const teamMap = new Map<string, string>(); // name → id

  for (const t of TEAMS) {
    // Try to find by slug first (handles renames like Czech Republic → Czechia)
    const existing = await prisma.team.findFirst({
      where: { OR: [{ slug: t.slug }, { name: t.name }] },
    });

    let team: { id: string };
    if (existing) {
      team = await prisma.team.update({
        where: { id: existing.id },
        data: { name: t.name, slug: t.slug, country: t.country, logo: t.logo },
      });
      console.log(`  ↻  ${t.name}`);
    } else {
      team = await prisma.team.create({
        data: { name: t.name, slug: t.slug, country: t.country, logo: t.logo },
      });
      console.log(`  +  ${t.name} (created)`);
    }
    teamMap.set(t.name, team.id);
  }

  // 3. Delete ALL existing matches for this tournament (they are wrong)
  console.log('\n🗑️   Deleting all existing WC matches…');
  const deleted = await prisma.match.deleteMany({
    where: { tournamentId: tournament.id },
  });
  console.log(`    Deleted ${deleted.count} matches`);

  // 4. Create all 72 group-stage fixtures
  console.log('\n⚽  Creating 72 group-stage matches…');
  let created = 0;

  for (const f of FIXTURES) {
    const homeId = teamMap.get(f.home);
    const awayId = teamMap.get(f.away);

    if (!homeId || !awayId) {
      console.warn(`  ⚠️  Missing team for: ${f.home} vs ${f.away}`);
      continue;
    }

    const matchTime = edtToUtc(f.date, f.et);
    const isFinished = f.score !== null;
    const [homeScore, awayScore] = isFinished
      ? f.score!.split('-').map(Number)
      : [null, null];

    const slug = slugify(`wc2026-${f.group}-${f.home}-vs-${f.away}`);
    const title = `${f.home} vs ${f.away}`;

    await prisma.match.create({
      data: {
        title,
        slug,
        homeTeamId: homeId,
        awayTeamId: awayId,
        tournamentId: tournament.id,
        matchTime,
        status: isFinished ? 'FINISHED' : 'UPCOMING',
        homeScore,
        awayScore,
        isActive: true,
      },
    });

    const utcStr = matchTime.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
    console.log(
      `  ${isFinished ? '✓' : '+'} [${f.group}] ${f.home} vs ${f.away}  ${utcStr}${isFinished ? `  (${f.score})` : ''}`,
    );
    created++;
  }

  console.log(`\n✅  Done — ${created}/72 matches created`);
  console.log('   Run "Import ESPN Schedule" from the admin to link ESPN event IDs.\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
