import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import slugify from 'slugify';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NewsSyncService implements OnModuleInit {
  private readonly logger = new Logger(NewsSyncService.name);
  private authorId: string | null = null;
  private categoryId: string | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    await this.ensureResources();
    // Fire initial sync without blocking startup
    this.syncNews().catch((e) =>
      this.logger.warn(`Initial news sync failed: ${e.message}`),
    );
  }

  private async ensureResources() {
    const admin = await this.prisma.user.findFirst();
    if (admin) this.authorId = admin.id;

    let cat = await this.prisma.category.findFirst({
      where: { slug: 'sports-news' },
    });
    if (!cat) {
      cat = await this.prisma.category.create({
        data: {
          name: 'Sports News',
          slug: 'sports-news',
          description: 'Auto-synced sports news from NewsAPI',
          color: '#22c55e',
          isActive: true,
          sortOrder: 0,
        },
      });
      this.logger.log('Created "Sports News" category');
    }
    this.categoryId = cat.id;
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async syncNews(): Promise<{ synced: number; total: number }> {
    if (!this.authorId || !this.categoryId) {
      await this.ensureResources();
      if (!this.authorId) {
        this.logger.warn('No user found — skipping news sync');
        return { synced: 0, total: 0 };
      }
    }

    const apiKey = this.config.get<string>('news.apiKey');
    const apiUrl = this.config.get<string>('news.apiUrl');

    if (!apiKey) {
      this.logger.warn('NEWS_API_KEY not configured');
      return { synced: 0, total: 0 };
    }

    const articles = await this.fetchArticles(apiKey, apiUrl!);
    if (!articles.length) return { synced: 0, total: 0 };

    let synced = 0;
    for (const a of articles) {
      if (!a.title || a.title === '[Removed]') continue;

      const exists = await this.prisma.article.findFirst({
        where: { title: a.title },
      });
      if (exists) continue;

      const baseSlug = slugify(a.title, {
        lower: true,
        strict: true,
        trim: true,
      }).slice(0, 80);
      const slug = `${baseSlug}-${Date.now()}`;
      const rawContent: string =
        a.content || a.description || 'Read more at the source.';
      const content = rawContent.replace(/\[\+\d+ chars\]$/, '');

      try {
        await this.prisma.article.create({
          data: {
            title: a.title,
            slug,
            excerpt: (a.description || '').slice(0, 250),
            content,
            featuredImage: a.urlToImage || null,
            authorId: this.authorId!,
            categoryId: this.categoryId!,
            status: 'PUBLISHED',
            publishedAt: a.publishedAt ? new Date(a.publishedAt) : new Date(),
            tags: ['auto-synced', `source:${a.source?.name || 'NewsAPI'}`],
            metaTitle: a.title,
            metaDescription: (a.description || '').slice(0, 160),
            readTime: Math.max(1, Math.ceil(content.split(' ').length / 200)),
          },
        });
        synced++;
      } catch (_) {
        // Skip on duplicate slug or other DB constraint
      }
    }

    this.logger.log(`News sync complete: ${synced}/${articles.length} new articles`);
    return { synced, total: articles.length };
  }

  private async fetchArticles(apiKey: string, apiUrl: string): Promise<any[]> {
    // Try top-headlines/sports first, fall back to everything/football
    try {
      const res = await firstValueFrom(
        this.http.get(`${apiUrl}/top-headlines`, {
          params: { category: 'sports', language: 'en', pageSize: 20, apiKey },
        }),
      );
      return res.data?.articles || [];
    } catch {
      /* fallthrough */
    }

    try {
      const res = await firstValueFrom(
        this.http.get(`${apiUrl}/everything`, {
          params: {
            q: 'football OR soccer',
            language: 'en',
            sortBy: 'publishedAt',
            pageSize: 20,
            apiKey,
          },
        }),
      );
      return res.data?.articles || [];
    } catch (e: any) {
      this.logger.error(`NewsAPI fetch failed: ${e.message}`);
      return [];
    }
  }
}
