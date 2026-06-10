import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly svc;
    constructor(svc: AnalyticsService);
    track(body: {
        path: string;
        referrer?: string;
    }): Promise<{
        path: string;
        id: string;
        createdAt: Date;
        country: string | null;
        referrer: string | null;
        userAgent: string | null;
        ip: string | null;
    }>;
    getDashboard(): Promise<{
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
    getViews(days: string): Promise<(import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.PageViewGroupByOutputType, "createdAt"[]> & {
        _count: {
            createdAt: number;
        };
    })[]>;
}
