import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async trackPageView(data: {
    path: string;
    referrer?: string;
    userAgent?: string;
    ip?: string;
  }) {
    return this.prisma.pageView.create({ data });
  }

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      todayViews,
      totalViews,
      topArticles,
      topMatches,
      articleStats,
      matchStats,
      recentViews,
    ] = await Promise.all([
      this.prisma.pageView.count({ where: { createdAt: { gte: today } } }),
      this.prisma.pageView.count(),
      this.prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { viewCount: 'desc' },
        take: 10,
        select: { id: true, title: true, slug: true, viewCount: true, publishedAt: true },
      }),
      this.prisma.match.findMany({
        orderBy: { viewCount: 'desc' },
        take: 10,
        select: {
          id: true, title: true, slug: true, viewCount: true, status: true,
          homeTeam: { select: { name: true } },
          awayTeam: { select: { name: true } },
        },
      }),
      this.prisma.article.aggregate({
        _sum: { viewCount: true },
        _count: true,
      }),
      this.prisma.match.aggregate({
        _sum: { viewCount: true },
        _count: true,
      }),
      this.prisma.pageView.groupBy({
        by: ['path'],
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 10,
      }),
    ]);

    return {
      todayViews,
      totalViews,
      totalArticleViews: articleStats._sum.viewCount || 0,
      totalMatchViews: matchStats._sum.viewCount || 0,
      totalArticles: articleStats._count,
      totalMatches: matchStats._count,
      topArticles,
      topMatches,
      topPages: recentViews,
    };
  }

  async getViewsOverTime(days = 7) {
    const start = new Date();
    start.setDate(start.getDate() - days);

    const views = await this.prisma.pageView.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: start } },
      _count: { createdAt: true },
    });

    return views;
  }
}
