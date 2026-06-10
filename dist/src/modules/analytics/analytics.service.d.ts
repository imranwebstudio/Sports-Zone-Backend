import { PrismaService } from '../../prisma/prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    trackPageView(data: {
        path: string;
        referrer?: string;
        userAgent?: string;
        ip?: string;
    }): Promise<{
        path: string;
        id: string;
        createdAt: Date;
        country: string | null;
        referrer: string | null;
        userAgent: string | null;
        ip: string | null;
    }>;
    getDashboardStats(): Promise<{
        todayViews: number;
        totalViews: number;
        totalArticleViews: number;
        totalMatchViews: number;
        totalArticles: number;
        totalMatches: number;
        topArticles: {
            id: string;
            slug: string;
            title: string;
            viewCount: number;
            publishedAt: Date | null;
        }[];
        topMatches: {
            id: string;
            slug: string;
            title: string;
            status: import("@prisma/client").$Enums.MatchStatus;
            viewCount: number;
            homeTeam: {
                name: string;
            };
            awayTeam: {
                name: string;
            };
        }[];
        topPages: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.PageViewGroupByOutputType, "path"[]> & {
            _count: {
                path: number;
            };
        })[];
    }>;
    getViewsOverTime(days?: number): Promise<(import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.PageViewGroupByOutputType, "createdAt"[]> & {
        _count: {
            createdAt: number;
        };
    })[]>;
}
