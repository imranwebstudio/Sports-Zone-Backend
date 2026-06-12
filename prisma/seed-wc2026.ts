/**
 * FIFA World Cup 2026 seed
 * 48 national teams  •  1 tournament  •  72 group-stage matches
 *
 * Groups are based on the December 2024 official draw.
 * Dates are approximate UTC kick-off times.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL!) });

// ─── helpers ────────────────────────────────────────────────────────────────

const flag = (code: string) => `https://flagcdn.com/w160/${code}.png`;
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const dt = (y: number, m: number, d: number, h: number, min = 0) =>
  new Date(Date.UTC(y, m - 1, d, h, min));

// ─── 48 national teams ───────────────────────────────────────────────────────

const NATIONAL_TEAMS = [
  // Group A
  { name: 'United States',    slug: 'usa',            country: 'USA',          logo: flag('us') },
  { name: 'Panama',           slug: 'panama',         country: 'Panama',       logo: flag('pa') },
  { name: 'Uruguay',          slug: 'uruguay',        country: 'Uruguay',      logo: flag('uy') },
  { name: 'Bolivia',          slug: 'bolivia',        country: 'Bolivia',      logo: flag('bo') },

  // Group B
  { name: 'Mexico',           slug: 'mexico',         country: 'Mexico',       logo: flag('mx') },
  { name: 'Ecuador',          slug: 'ecuador',        country: 'Ecuador',      logo: flag('ec') },
  { name: 'Venezuela',        slug: 'venezuela',      country: 'Venezuela',    logo: flag('ve') },
  { name: 'New Zealand',      slug: 'new-zealand',    country: 'New Zealand',  logo: flag('nz') },

  // Group C
  { name: 'Canada',           slug: 'canada',         country: 'Canada',       logo: flag('ca') },
  { name: 'Honduras',         slug: 'honduras',       country: 'Honduras',     logo: flag('hn') },
  { name: 'Morocco',          slug: 'morocco',        country: 'Morocco',      logo: flag('ma') },
  { name: 'Portugal',         slug: 'portugal',       country: 'Portugal',     logo: flag('pt') },

  // Group D
  { name: 'Germany',          slug: 'germany',        country: 'Germany',      logo: flag('de') },
  { name: 'Japan',            slug: 'japan',          country: 'Japan',        logo: flag('jp') },
  { name: 'Paraguay',         slug: 'paraguay',       country: 'Paraguay',     logo: flag('py') },
  { name: 'Australia',        slug: 'australia',      country: 'Australia',    logo: flag('au') },

  // Group E
  { name: 'Spain',            slug: 'spain',          country: 'Spain',        logo: flag('es') },
  { name: 'Serbia',           slug: 'serbia',         country: 'Serbia',       logo: flag('rs') },
  { name: 'Senegal',          slug: 'senegal',        country: 'Senegal',      logo: flag('sn') },
  { name: 'Costa Rica',       slug: 'costa-rica',     country: 'Costa Rica',   logo: flag('cr') },

  // Group F
  { name: 'France',           slug: 'france',         country: 'France',       logo: flag('fr') },
  { name: 'South Africa',     slug: 'south-africa',   country: 'South Africa', logo: flag('za') },
  { name: 'Croatia',          slug: 'croatia',        country: 'Croatia',      logo: flag('hr') },
  { name: 'Argentina',        slug: 'argentina',      country: 'Argentina',    logo: flag('ar') },

  // Group G
  { name: 'Brazil',           slug: 'brazil',         country: 'Brazil',       logo: flag('br') },
  { name: 'Denmark',          slug: 'denmark',        country: 'Denmark',      logo: flag('dk') },
  { name: 'Nigeria',          slug: 'nigeria',        country: 'Nigeria',      logo: flag('ng') },
  { name: 'Saudi Arabia',     slug: 'saudi-arabia',   country: 'Saudi Arabia', logo: flag('sa') },

  // Group H
  { name: 'Netherlands',      slug: 'netherlands',    country: 'Netherlands',  logo: flag('nl') },
  { name: 'Belgium',          slug: 'belgium',        country: 'Belgium',      logo: flag('be') },
  { name: 'Iran',             slug: 'iran',           country: 'Iran',         logo: flag('ir') },
  { name: 'DR Congo',         slug: 'dr-congo',       country: 'DR Congo',     logo: flag('cd') },

  // Group I
  { name: 'England',          slug: 'england',        country: 'England',      logo: flag('gb-eng') },
  { name: 'Italy',            slug: 'italy',          country: 'Italy',        logo: flag('it') },
  { name: 'Ghana',            slug: 'ghana',          country: 'Ghana',        logo: flag('gh') },
  { name: 'Colombia',         slug: 'colombia',       country: 'Colombia',     logo: flag('co') },

  // Group J
  { name: 'South Korea',      slug: 'south-korea',    country: 'South Korea',  logo: flag('kr') },
  { name: 'Austria',          slug: 'austria',        country: 'Austria',      logo: flag('at') },
  { name: 'Ivory Coast',      slug: 'ivory-coast',    country: 'Ivory Coast',  logo: flag('ci') },
  { name: 'Cameroon',         slug: 'cameroon',       country: 'Cameroon',     logo: flag('cm') },

  // Group K
  { name: 'Turkey',           slug: 'turkey',         country: 'Turkey',       logo: flag('tr') },
  { name: 'Scotland',         slug: 'scotland',       country: 'Scotland',     logo: flag('gb-sct') },
  { name: 'Hungary',          slug: 'hungary',        country: 'Hungary',      logo: flag('hu') },
  { name: 'Egypt',            slug: 'egypt',          country: 'Egypt',        logo: flag('eg') },

  // Group L
  { name: 'Switzerland',      slug: 'switzerland',    country: 'Switzerland',  logo: flag('ch') },
  { name: 'Iraq',             slug: 'iraq',           country: 'Iraq',         logo: flag('iq') },
  { name: 'Indonesia',        slug: 'indonesia',      country: 'Indonesia',    logo: flag('id') },
  { name: 'Uzbekistan',       slug: 'uzbekistan',     country: 'Uzbekistan',   logo: flag('uz') },
];

// ─── groups definition ───────────────────────────────────────────────────────

// Each group: [T1, T2, T3, T4] (by team slug)
// Matches: MD1 → T1vT2, T3vT4 | MD2 → T1vT3, T2vT4 | MD3 → T1vT4, T2vT3 (simultaneous)
const GROUPS: { name: string; teams: string[]; md1: string; md2: string; md3: string }[] = [
  { name: 'A', teams: ['usa',         'panama',      'uruguay',     'bolivia'],      md1: '2026-06-11', md2: '2026-06-18', md3: '2026-06-25' },
  { name: 'B', teams: ['mexico',      'ecuador',     'venezuela',   'new-zealand'],  md1: '2026-06-12', md2: '2026-06-19', md3: '2026-06-26' },
  { name: 'C', teams: ['canada',      'honduras',    'morocco',     'portugal'],     md1: '2026-06-13', md2: '2026-06-20', md3: '2026-06-27' },
  { name: 'D', teams: ['germany',     'japan',       'paraguay',    'australia'],    md1: '2026-06-14', md2: '2026-06-21', md3: '2026-06-28' },
  { name: 'E', teams: ['spain',       'serbia',      'senegal',     'costa-rica'],   md1: '2026-06-15', md2: '2026-06-22', md3: '2026-06-29' },
  { name: 'F', teams: ['france',      'south-africa','croatia',     'argentina'],    md1: '2026-06-16', md2: '2026-06-23', md3: '2026-06-30' },
  { name: 'G', teams: ['brazil',      'denmark',     'nigeria',     'saudi-arabia'], md1: '2026-06-17', md2: '2026-06-24', md3: '2026-07-01' },
  { name: 'H', teams: ['netherlands', 'belgium',     'iran',        'dr-congo'],     md1: '2026-06-18', md2: '2026-06-25', md3: '2026-07-02' },
  { name: 'I', teams: ['england',     'italy',       'ghana',       'colombia'],     md1: '2026-06-19', md2: '2026-06-26', md3: '2026-07-03' },
  { name: 'J', teams: ['south-korea', 'austria',     'ivory-coast', 'cameroon'],     md1: '2026-06-20', md2: '2026-06-27', md3: '2026-07-04' },
  { name: 'K', teams: ['turkey',      'scotland',    'hungary',     'egypt'],        md1: '2026-06-21', md2: '2026-06-28', md3: '2026-07-05' },
  { name: 'L', teams: ['switzerland', 'iraq',        'indonesia',   'uzbekistan'],   md1: '2026-06-22', md2: '2026-06-29', md3: '2026-07-06' },
];

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌍 Seeding FIFA World Cup 2026...\n');

  // 1. Upsert national teams
  console.log('📋 Upserting 48 national teams...');
  const teamIdMap: Record<string, string> = {};

  for (const t of NATIONAL_TEAMS) {
    const record = await prisma.team.upsert({
      where: { slug: t.slug },
      update: { logo: t.logo, country: t.country },
      create: { ...t, sport: 'Football' },
    });
    teamIdMap[t.slug] = record.id;
    process.stdout.write(`  ✓ ${t.name}\n`);
  }

  // 2. Upsert tournament
  console.log('\n🏆 Upserting tournament...');
  const tournament = await prisma.tournament.upsert({
    where: { slug: 'fifa-world-cup-2026' },
    update: {},
    create: {
      name: 'FIFA World Cup 2026',
      slug: 'fifa-world-cup-2026',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/72/2026_FIFA_World_Cup_emblem.svg/200px-2026_FIFA_World_Cup_emblem.svg.png',
      country: 'USA / Canada / Mexico',
      sport: 'Football',
      isActive: true,
      sortOrder: 1,
    },
  });
  console.log(`  ✓ ${tournament.name} (id: ${tournament.id})\n`);

  // 3. Generate 72 group-stage matches
  console.log('⚽ Creating 72 group-stage matches...');

  const parseDate = (s: string) => {
    const [y, m, d] = s.split('-').map(Number);
    return { y, m, d };
  };

  let created = 0;
  let skipped = 0;

  for (const group of GROUPS) {
    const [t1, t2, t3, t4] = group.teams;
    const gLabel = `Group ${group.name}`;

    // Matchday 1: T1 vs T2 (19:00), T3 vs T4 (22:00)
    const md1 = parseDate(group.md1);
    // Matchday 2: T1 vs T3 (19:00), T2 vs T4 (22:00)
    const md2 = parseDate(group.md2);
    // Matchday 3 (simultaneous): T1 vs T4 + T2 vs T3 (both at 22:00)
    const md3 = parseDate(group.md3);

    const fixtures = [
      // MD1
      { home: t1, away: t2, date: dt(md1.y, md1.m, md1.d, 19), label: `${gLabel} MD1` },
      { home: t3, away: t4, date: dt(md1.y, md1.m, md1.d, 22), label: `${gLabel} MD1` },
      // MD2
      { home: t1, away: t3, date: dt(md2.y, md2.m, md2.d, 19), label: `${gLabel} MD2` },
      { home: t2, away: t4, date: dt(md2.y, md2.m, md2.d, 22), label: `${gLabel} MD2` },
      // MD3
      { home: t1, away: t4, date: dt(md3.y, md3.m, md3.d, 22), label: `${gLabel} MD3` },
      { home: t2, away: t3, date: dt(md3.y, md3.m, md3.d, 22), label: `${gLabel} MD3` },
    ];

    for (const f of fixtures) {
      const homeId = teamIdMap[f.home];
      const awayId = teamIdMap[f.away];
      if (!homeId || !awayId) {
        console.warn(`  ⚠ Missing team ID for ${f.home} or ${f.away}`);
        skipped++;
        continue;
      }

      const homeName = NATIONAL_TEAMS.find((t) => t.slug === f.home)!.name;
      const awayName = NATIONAL_TEAMS.find((t) => t.slug === f.away)!.name;
      const title = `${homeName} vs ${awayName}`;
      const slug = slugify(`wc2026-${group.name}-${f.home}-vs-${f.away}`);

      await prisma.match.upsert({
        where: { slug },
        update: {},
        create: {
          title,
          slug,
          homeTeamId: homeId,
          awayTeamId: awayId,
          tournamentId: tournament.id,
          matchTime: f.date,
          status: 'UPCOMING',
          destinationType: 'INTERNAL',
          isFeatured: false,
          isActive: true,
        },
      });
      process.stdout.write(`  ✓ ${title}\n`);
      created++;
    }
  }

  console.log(`\n✅ Done — ${created} matches created, ${skipped} skipped`);
  console.log(`   Tournament: ${tournament.name}`);
  console.log(`   Teams: ${NATIONAL_TEAMS.length}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
