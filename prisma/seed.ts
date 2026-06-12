import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL!) });

const CREST = (id: number) => `https://crests.football-data.org/${id}.png`;
const WIKI = (file: string) => `https://upload.wikimedia.org/wikipedia/en/thumb/${file}/200px-${file.split('/').pop()}`;

const teams = [
  // ─── Premier League ──────────────────────────────────────────────────────────
  { name: 'Arsenal', slug: 'arsenal', country: 'England', logo: CREST(57) },
  { name: 'Aston Villa', slug: 'aston-villa', country: 'England', logo: CREST(58) },
  { name: 'Bournemouth', slug: 'bournemouth', country: 'England', logo: CREST(1044) },
  { name: 'Brentford', slug: 'brentford', country: 'England', logo: CREST(402) },
  { name: 'Brighton & Hove Albion', slug: 'brighton', country: 'England', logo: CREST(397) },
  { name: 'Chelsea', slug: 'chelsea', country: 'England', logo: CREST(61) },
  { name: 'Crystal Palace', slug: 'crystal-palace', country: 'England', logo: CREST(354) },
  { name: 'Everton', slug: 'everton', country: 'England', logo: CREST(62) },
  { name: 'Fulham', slug: 'fulham', country: 'England', logo: CREST(63) },
  { name: 'Ipswich Town', slug: 'ipswich-town', country: 'England', logo: CREST(57) },
  { name: 'Leicester City', slug: 'leicester-city', country: 'England', logo: CREST(338) },
  { name: 'Liverpool', slug: 'liverpool', country: 'England', logo: CREST(64) },
  { name: 'Manchester City', slug: 'manchester-city', country: 'England', logo: CREST(65) },
  { name: 'Manchester United', slug: 'manchester-united', country: 'England', logo: CREST(66) },
  { name: 'Newcastle United', slug: 'newcastle-united', country: 'England', logo: CREST(67) },
  { name: 'Nottingham Forest', slug: 'nottingham-forest', country: 'England', logo: CREST(351) },
  { name: 'Southampton', slug: 'southampton', country: 'England', logo: CREST(340) },
  { name: 'Tottenham Hotspur', slug: 'tottenham-hotspur', country: 'England', logo: CREST(73) },
  { name: 'West Ham United', slug: 'west-ham-united', country: 'England', logo: CREST(563) },
  { name: 'Wolverhampton Wanderers', slug: 'wolverhampton-wanderers', country: 'England', logo: CREST(76) },

  // ─── Championship ────────────────────────────────────────────────────────────
  { name: 'Leeds United', slug: 'leeds-united', country: 'England', logo: CREST(341) },
  { name: 'Burnley', slug: 'burnley', country: 'England', logo: CREST(328) },
  { name: 'Sheffield United', slug: 'sheffield-united', country: 'England', logo: CREST(356) },

  // ─── La Liga ─────────────────────────────────────────────────────────────────
  { name: 'Real Madrid', slug: 'real-madrid', country: 'Spain', logo: CREST(86) },
  { name: 'FC Barcelona', slug: 'fc-barcelona', country: 'Spain', logo: CREST(81) },
  { name: 'Atlético Madrid', slug: 'atletico-madrid', country: 'Spain', logo: CREST(78) },
  { name: 'Athletic Club', slug: 'athletic-club', country: 'Spain', logo: CREST(77) },
  { name: 'Real Sociedad', slug: 'real-sociedad', country: 'Spain', logo: CREST(92) },
  { name: 'Villarreal CF', slug: 'villarreal', country: 'Spain', logo: CREST(94) },
  { name: 'Real Betis', slug: 'real-betis', country: 'Spain', logo: CREST(90) },
  { name: 'Valencia CF', slug: 'valencia', country: 'Spain', logo: CREST(95) },
  { name: 'Sevilla FC', slug: 'sevilla', country: 'Spain', logo: CREST(559) },
  { name: 'Rayo Vallecano', slug: 'rayo-vallecano', country: 'Spain', logo: CREST(87) },
  { name: 'CA Osasuna', slug: 'osasuna', country: 'Spain', logo: CREST(553) },
  { name: 'Celta de Vigo', slug: 'celta-vigo', country: 'Spain', logo: CREST(558) },
  { name: 'Getafe CF', slug: 'getafe', country: 'Spain', logo: CREST(560) },
  { name: 'Girona FC', slug: 'girona', country: 'Spain', logo: CREST(298) },
  { name: 'RCD Mallorca', slug: 'mallorca', country: 'Spain', logo: CREST(89) },
  { name: 'Deportivo Alavés', slug: 'deportivo-alaves', country: 'Spain', logo: CREST(263) },
  { name: 'RCD Espanyol', slug: 'espanyol', country: 'Spain', logo: CREST(80) },
  { name: 'UD Las Palmas', slug: 'las-palmas', country: 'Spain', logo: CREST(275) },
  { name: 'Real Valladolid', slug: 'real-valladolid', country: 'Spain', logo: CREST(250) },
  { name: 'Leganés', slug: 'leganes', country: 'Spain', logo: CREST(745) },

  // ─── Bundesliga ──────────────────────────────────────────────────────────────
  { name: 'Bayern Munich', slug: 'bayern-munich', country: 'Germany', logo: CREST(5) },
  { name: 'Borussia Dortmund', slug: 'borussia-dortmund', country: 'Germany', logo: CREST(4) },
  { name: 'RB Leipzig', slug: 'rb-leipzig', country: 'Germany', logo: CREST(721) },
  { name: 'Bayer Leverkusen', slug: 'bayer-leverkusen', country: 'Germany', logo: CREST(3) },
  { name: 'Eintracht Frankfurt', slug: 'eintracht-frankfurt', country: 'Germany', logo: CREST(19) },
  { name: 'VfB Stuttgart', slug: 'vfb-stuttgart', country: 'Germany', logo: CREST(10) },
  { name: 'VfL Wolfsburg', slug: 'wolfsburg', country: 'Germany', logo: CREST(11) },
  { name: 'Borussia Mönchengladbach', slug: 'borussia-monchengladbach', country: 'Germany', logo: CREST(18) },
  { name: 'SC Freiburg', slug: 'sc-freiburg', country: 'Germany', logo: CREST(17) },
  { name: '1. FC Union Berlin', slug: 'union-berlin', country: 'Germany', logo: CREST(28) },
  { name: 'Werder Bremen', slug: 'werder-bremen', country: 'Germany', logo: CREST(12) },
  { name: 'TSG Hoffenheim', slug: 'hoffenheim', country: 'Germany', logo: CREST(6) },
  { name: '1. FSV Mainz 05', slug: 'mainz-05', country: 'Germany', logo: CREST(15) },
  { name: 'FC Augsburg', slug: 'fc-augsburg', country: 'Germany', logo: CREST(16) },
  { name: '1. FC Köln', slug: 'fc-koln', country: 'Germany', logo: CREST(13) },
  { name: 'VfL Bochum', slug: 'vfl-bochum', country: 'Germany', logo: CREST(36) },
  { name: 'FC St. Pauli', slug: 'fc-st-pauli', country: 'Germany', logo: CREST(179) },
  { name: 'Holstein Kiel', slug: 'holstein-kiel', country: 'Germany', logo: CREST(720) },

  // ─── Serie A ─────────────────────────────────────────────────────────────────
  { name: 'Juventus', slug: 'juventus', country: 'Italy', logo: CREST(109) },
  { name: 'Inter Milan', slug: 'inter-milan', country: 'Italy', logo: CREST(108) },
  { name: 'AC Milan', slug: 'ac-milan', country: 'Italy', logo: CREST(98) },
  { name: 'Napoli', slug: 'napoli', country: 'Italy', logo: CREST(113) },
  { name: 'AS Roma', slug: 'as-roma', country: 'Italy', logo: CREST(100) },
  { name: 'SS Lazio', slug: 'ss-lazio', country: 'Italy', logo: CREST(110) },
  { name: 'Atalanta', slug: 'atalanta', country: 'Italy', logo: CREST(102) },
  { name: 'Fiorentina', slug: 'fiorentina', country: 'Italy', logo: CREST(99) },
  { name: 'Torino FC', slug: 'torino', country: 'Italy', logo: CREST(103) },
  { name: 'Bologna FC', slug: 'bologna', country: 'Italy', logo: CREST(107) },
  { name: 'Udinese', slug: 'udinese', country: 'Italy', logo: CREST(104) },
  { name: 'AC Monza', slug: 'monza', country: 'Italy', logo: CREST(586) },
  { name: 'Genoa CFC', slug: 'genoa', country: 'Italy', logo: CREST(106) },
  { name: 'Cagliari', slug: 'cagliari', country: 'Italy', logo: CREST(101) },
  { name: 'Hellas Verona', slug: 'hellas-verona', country: 'Italy', logo: CREST(450) },
  { name: 'Empoli FC', slug: 'empoli', country: 'Italy', logo: CREST(471) },
  { name: 'Venezia FC', slug: 'venezia', country: 'Italy', logo: CREST(454) },
  { name: 'Parma Calcio 1913', slug: 'parma', country: 'Italy', logo: CREST(115) },
  { name: 'Como 1907', slug: 'como', country: 'Italy', logo: CREST(116) },
  { name: 'Lecce', slug: 'lecce', country: 'Italy', logo: CREST(462) },

  // ─── Ligue 1 ─────────────────────────────────────────────────────────────────
  { name: 'Paris Saint-Germain', slug: 'paris-saint-germain', country: 'France', logo: CREST(524) },
  { name: 'Olympique de Marseille', slug: 'olympique-marseille', country: 'France', logo: CREST(516) },
  { name: 'Olympique Lyonnais', slug: 'olympique-lyonnais', country: 'France', logo: CREST(523) },
  { name: 'AS Monaco', slug: 'as-monaco', country: 'France', logo: CREST(548) },
  { name: 'Lille OSC', slug: 'lille', country: 'France', logo: CREST(521) },
  { name: 'OGC Nice', slug: 'ogc-nice', country: 'France', logo: CREST(522) },
  { name: 'Stade Rennais FC', slug: 'stade-rennais', country: 'France', logo: CREST(519) },
  { name: 'RC Lens', slug: 'rc-lens', country: 'France', logo: CREST(546) },
  { name: 'Montpellier HSC', slug: 'montpellier', country: 'France', logo: CREST(518) },
  { name: 'RC Strasbourg', slug: 'rc-strasbourg', country: 'France', logo: CREST(576) },
  { name: 'FC Nantes', slug: 'fc-nantes', country: 'France', logo: CREST(527) },
  { name: 'Stade Brestois 29', slug: 'stade-brestois', country: 'France', logo: CREST(512) },
  { name: 'Toulouse FC', slug: 'toulouse', country: 'France', logo: CREST(514) },
  { name: 'Stade de Reims', slug: 'stade-de-reims', country: 'France', logo: CREST(528) },
  { name: 'Le Havre AC', slug: 'le-havre', country: 'France', logo: CREST(513) },
  { name: 'FC Lorient', slug: 'fc-lorient', country: 'France', logo: CREST(530) },
  { name: 'AJ Auxerre', slug: 'aj-auxerre', country: 'France', logo: CREST(511) },
  { name: 'Angers SCO', slug: 'angers', country: 'France', logo: CREST(515) },

  // ─── Other Notable Clubs ─────────────────────────────────────────────────────
  // Portugal
  { name: 'FC Porto', slug: 'fc-porto', country: 'Portugal', logo: CREST(503) },
  { name: 'SL Benfica', slug: 'sl-benfica', country: 'Portugal', logo: CREST(1903) },
  { name: 'Sporting CP', slug: 'sporting-cp', country: 'Portugal', logo: CREST(498) },

  // Netherlands
  { name: 'Ajax', slug: 'ajax', country: 'Netherlands', logo: CREST(610) },
  { name: 'PSV Eindhoven', slug: 'psv-eindhoven', country: 'Netherlands', logo: CREST(674) },
  { name: 'Feyenoord', slug: 'feyenoord', country: 'Netherlands', logo: CREST(628) },

  // Scotland
  { name: 'Celtic FC', slug: 'celtic', country: 'Scotland', logo: CREST(732) },
  { name: 'Rangers FC', slug: 'rangers', country: 'Scotland', logo: CREST(733) },

  // Turkey
  { name: 'Galatasaray', slug: 'galatasaray', country: 'Turkey', logo: CREST(2032) },
  { name: 'Fenerbahçe', slug: 'fenerbahce', country: 'Turkey', logo: CREST(2035) },
  { name: 'Beşiktaş', slug: 'besiktas', country: 'Turkey', logo: CREST(2030) },

  // Belgium
  { name: 'Club Brugge', slug: 'club-brugge', country: 'Belgium', logo: CREST(851) },
  { name: 'RSC Anderlecht', slug: 'anderlecht', country: 'Belgium', logo: CREST(548) },

  // Russia / Ukraine
  { name: 'Shakhtar Donetsk', slug: 'shakhtar-donetsk', country: 'Ukraine', logo: CREST(1144) },

  // Saudi Arabia
  { name: 'Al Hilal', slug: 'al-hilal', country: 'Saudi Arabia', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/Al-Hilal_FC_logo.svg/200px-Al-Hilal_FC_logo.svg.png' },
  { name: 'Al Nassr', slug: 'al-nassr', country: 'Saudi Arabia', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b3/Al_Nassr_FC.svg/200px-Al_Nassr_FC.svg.png' },
  { name: 'Al Ittihad', slug: 'al-ittihad', country: 'Saudi Arabia', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b3/AlIttihadClub2021.svg/200px-AlIttihadClub2021.svg.png' },
  { name: 'Al Ahli', slug: 'al-ahli', country: 'Saudi Arabia', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/dc/Al-Ahli_Saudi_FC.svg/200px-Al-Ahli_Saudi_FC.svg.png' },

  // USA
  { name: 'LA Galaxy', slug: 'la-galaxy', country: 'USA', logo: CREST(1611) },
  { name: 'Inter Miami CF', slug: 'inter-miami', country: 'USA', logo: CREST(2095) },
  { name: 'NYCFC', slug: 'new-york-city-fc', country: 'USA', logo: CREST(1617) },
  { name: 'Seattle Sounders', slug: 'seattle-sounders', country: 'USA', logo: CREST(1622) },
];

async function main() {
  console.log('🌱 Seeding football teams...\n');

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const team of teams) {
    try {
      const result = await prisma.team.upsert({
        where: { slug: team.slug },
        update: { logo: team.logo, country: team.country },
        create: { ...team, sport: 'Football' },
      });
      if (result.createdAt.getTime() === result.createdAt.getTime()) {
        created++;
        process.stdout.write(`  ✓ ${team.name}\n`);
      }
    } catch (err: any) {
      failed++;
      process.stdout.write(`  ✗ ${team.name}: ${err.message}\n`);
    }
  }

  console.log(`\n✅ Done — ${created} upserted, ${failed} failed`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
