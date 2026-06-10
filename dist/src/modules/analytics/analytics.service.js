"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async trackPageView(data) {
        return this.prisma.pageView.create({ data });
    }
    async getDashboardStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [todayViews, totalViews, topArticles, topMatches, articleStats, matchStats, recentViews,] = await Promise.all([
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map