import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import slugify from 'slugify';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import { PrismaService } from '../../prisma/prisma.service';

const RSS_FEEDS = [
  { url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', source: 'BBC Sport' },
  { url: 'https://www.skysports.com/rss/12040', source: 'Sky Sports' },
  { url: 'https://www.theguardian.com/football/rss', source: 'The Guardian' },
  { url: 'https://www.goal.com/feeds/en/news', source: 'Goal.com' },
  { url: 'https://www.espn.com/espn/rss/soccer/news', source: 'ESPN' },
  { url: 'https://sportstar.thehindu.com/football/feeder/default.rss', source: 'Sportstar' },
];

@Injectable()
export class NewsSyncService implements OnModuleInit {
  private readonly logger = new Logger(NewsSyncService.name);
  private readonly rssParser = new Parser({ timeout: 10000 });
  private authorId: string | null = null;
  private categoryId: string | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly http: HttpService,
  ) {}

  async onModuleInit() {
    await this.ensureResources();
    const count = await this.prisma.article.count();
    if (count === 0) {
      this.syncNews().catch((e) =>
        this.logger.warn(`Initial news sync failed: ${e.message}`),
      );
    }
  }

  private async ensureResources() {
    const admin = await this.prisma.user.findFirst();
    if (admin) this.authorId = admin.id;

    let cat = await this.prisma.category.findFirst({ where: { slug: 'sports-news' } });
    if (!cat) {
      cat = await this.prisma.category.create({
        data: {
          name: 'Sports News',
          slug: 'sports-news',
          description: 'Auto-synced sports news',
          color: '#22c55e',
          isActive: true,
          sortOrder: 0,
        },
      });
      this.logger.log('Created "Sports News" category');
    }
    this.categoryId = cat.id;
  }

  @Cron('0 */3 * * *') // every 3 hours
  async syncNews(): Promise<{ synced: number; total: number }> {
    if (!this.authorId || !this.categoryId) {
      await this.ensureResources();
      if (!this.authorId) {
        this.logger.warn('No user found — skipping news sync');
        return { synced: 0, total: 0 };
      }
    }

    const items = await this.fetchFromRss();
    if (!items.length) return { synced: 0, total: 0 };

    let synced = 0;
    for (const item of items) {
      if (!item.title || !item.link) continue;

      const exists = await this.prisma.article.findFirst({ where: { sourceUrl: item.link } });
      if (exists) continue;

      const baseSlug = slugify(item.title, { lower: true, strict: true, trim: true }).slice(0, 80);
      const slug = `${baseSlug}-${Date.now()}`;

      // Get image from RSS item first
      let featuredImage = this.extractRssImage(item);

      // Build content from RSS or scrape — also pick up image if RSS had none
      const rssHtml = item.content || item['content:encoded'] || '';
      const rssText = rssHtml ? cheerio.load(rssHtml).text().trim() : '';
      let content: string;

      if (rssText.length > 200) {
        content = rssText;
        // still try to get image from the HTML if not yet found
        if (!featuredImage) {
          const m = rssHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
          if (m) featuredImage = m[1];
        }
      } else {
        // Scrape the page — returns both content and image in one request
        const scraped = item.link ? await this.scrapeArticle(item.link) : null;
        const fallback = (item.contentSnippet || item.summary || '').replace(/\[\+\d+ chars\]$/, '');
        content = scraped?.content || fallback || 'Read more at the source.';
        if (!featuredImage && scraped?.image) featuredImage = scraped.image;
      }

      const excerpt = (item.contentSnippet || item.summary || '').slice(0, 250);

      try {
        await this.prisma.article.create({
          data: {
            title: item.title,
            slug,
            excerpt,
            content,
            featuredImage,
            sourceUrl: item.link,
            authorId: this.authorId!,
            categoryId: this.categoryId!,
            status: 'PUBLISHED',
            publishedAt: item.pubDate && !isNaN(new Date(item.pubDate).getTime())
              ? new Date(item.pubDate)
              : new Date(),
            tags: ['auto-synced', `source:${item._feedSource}`],
            metaTitle: item.title,
            metaDescription: excerpt.slice(0, 160),
            readTime: Math.max(1, Math.ceil(content.split(' ').length / 200)),
          },
        });
        synced++;
      } catch {
        // Skip duplicate slug or DB constraint violations
      }
    }

    this.logger.log(`News sync complete: ${synced}/${items.length} new articles`);
    return { synced, total: items.length };
  }

  async backfillContent(): Promise<{ updated: number; failed: number; skipped: number }> {
    const articles = await this.prisma.article.findMany({
      where: { tags: { has: 'auto-synced' }, sourceUrl: { not: null } },
      select: { id: true, sourceUrl: true, content: true, featuredImage: true },
    });

    let updated = 0, failed = 0, skipped = 0;
    for (const article of articles) {
      const hasContent = (article.content?.length ?? 0) > 500;
      const hasImage = !!article.featuredImage;
      if (hasContent && hasImage) { skipped++; continue; }

      const scraped = await this.scrapeArticle(article.sourceUrl!);
      if (!scraped) { failed++; continue; }

      await this.prisma.article.update({
        where: { id: article.id },
        data: {
          ...(!hasContent && scraped.content ? {
            content: scraped.content,
            readTime: Math.max(1, Math.ceil(scraped.content.split(' ').length / 200)),
          } : {}),
          ...(!hasImage && scraped.image ? { featuredImage: scraped.image } : {}),
        },
      });
      updated++;
    }

    this.logger.log(`Backfill: ${updated} updated, ${failed} failed, ${skipped} skipped`);
    return { updated, failed, skipped };
  }

  private async fetchFromRss(): Promise<any[]> {
    const results: any[] = [];
    for (const feed of RSS_FEEDS) {
      try {
        const parsed = await this.rssParser.parseURL(feed.url);
        const items = (parsed.items || []).slice(0, 10).map((item) => ({
          ...item,
          _feedSource: feed.source,
        }));
        results.push(...items);
        this.logger.debug(`RSS ${feed.source}: ${items.length} items`);
      } catch (e: any) {
        this.logger.warn(`RSS fetch failed [${feed.source}]: ${e.message}`);
      }
    }
    return results;
  }

  private extractRssImage(item: any): string | null {
    if (item.enclosure?.url && /image/i.test(item.enclosure.type || 'image')) return item.enclosure.url;
    if (item['media:content']?.url) return item['media:content'].url;
    if (item['media:thumbnail']?.url) return item['media:thumbnail'].url;
    return null;
  }

  private async scrapeArticle(url: string): Promise<{ content: string | null; image: string | null }> {
    try {
      const res = await firstValueFrom(
        this.http.get(url, {
          responseType: 'text',
          timeout: 8000,
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)', Accept: 'text/html' },
        }),
      );
      const $ = cheerio.load(res.data as string);

      // Extract image from og:image or twitter:image meta tags first
      const image =
        $('meta[property="og:image"]').attr('content') ||
        $('meta[name="twitter:image"]').attr('content') ||
        $('meta[name="twitter:image:src"]').attr('content') ||
        $('link[rel="image_src"]').attr('href') ||
        null;

      $('script,style,nav,header,footer,aside,.ad,.ads,.advertisement,.social-share,.related,.comments,noscript,iframe').remove();

      const selectors = [
        'article [class*="article-body"]',
        'article [class*="story-body"]',
        'article [class*="entry-content"]',
        '[class*="article-body"]',
        '[class*="story-body"]',
        '[class*="entry-content"]',
        '[class*="post-content"]',
        '[class*="article-content"]',
        '[class*="content-body"]',
        'article',
        '[role="main"] p',
        'main p',
      ];

      for (const sel of selectors) {
        const el = $(sel);
        if (!el.length) continue;
        const text = el.find('p').map((_, p) => $(p).text().trim()).get()
          .filter((t) => t.length > 40).join('\n\n');
        if (text.length > 200) return { content: text, image };
      }

      const paragraphs = $('p').map((_, p) => $(p).text().trim()).get().filter((t) => t.length > 40);
      const joined = paragraphs.join('\n\n');
      return { content: joined.length > 200 ? joined : null, image };
    } catch {
      return { content: null, image: null };
    }
  }
}
