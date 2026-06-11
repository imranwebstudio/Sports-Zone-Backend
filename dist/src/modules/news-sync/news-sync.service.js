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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var NewsSyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsSyncService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const slugify_1 = __importDefault(require("slugify"));
const prisma_service_1 = require("../../prisma/prisma.service");
let NewsSyncService = NewsSyncService_1 = class NewsSyncService {
    prisma;
    http;
    config;
    logger = new common_1.Logger(NewsSyncService_1.name);
    authorId = null;
    categoryId = null;
    constructor(prisma, http, config) {
        this.prisma = prisma;
        this.http = http;
        this.config = config;
    }
    async onModuleInit() {
        await this.ensureResources();
        this.syncNews().catch((e) => this.logger.warn(`Initial news sync failed: ${e.message}`));
    }
    async ensureResources() {
        const admin = await this.prisma.user.findFirst();
        if (admin)
            this.authorId = admin.id;
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
    async syncNews() {
        if (!this.authorId || !this.categoryId) {
            await this.ensureResources();
            if (!this.authorId) {
                this.logger.warn('No user found — skipping news sync');
                return { synced: 0, total: 0 };
            }
        }
        const apiKey = this.config.get('news.apiKey');
        const apiUrl = this.config.get('news.apiUrl');
        if (!apiKey) {
            this.logger.warn('NEWS_API_KEY not configured');
            return { synced: 0, total: 0 };
        }
        const articles = await this.fetchArticles(apiKey, apiUrl);
        if (!articles.length)
            return { synced: 0, total: 0 };
        let synced = 0;
        for (const a of articles) {
            if (!a.title || a.title === '[Removed]')
                continue;
            const exists = await this.prisma.article.findFirst({
                where: { title: a.title },
            });
            if (exists)
                continue;
            const baseSlug = (0, slugify_1.default)(a.title, {
                lower: true,
                strict: true,
                trim: true,
            }).slice(0, 80);
            const slug = `${baseSlug}-${Date.now()}`;
            const rawContent = a.content || a.description || 'Read more at the source.';
            const content = rawContent.replace(/\[\+\d+ chars\]$/, '');
            try {
                await this.prisma.article.create({
                    data: {
                        title: a.title,
                        slug,
                        excerpt: (a.description || '').slice(0, 250),
                        content,
                        featuredImage: a.urlToImage || null,
                        authorId: this.authorId,
                        categoryId: this.categoryId,
                        status: 'PUBLISHED',
                        publishedAt: a.publishedAt ? new Date(a.publishedAt) : new Date(),
                        tags: ['auto-synced', `source:${a.source?.name || 'NewsAPI'}`],
                        metaTitle: a.title,
                        metaDescription: (a.description || '').slice(0, 160),
                        readTime: Math.max(1, Math.ceil(content.split(' ').length / 200)),
                    },
                });
                synced++;
            }
            catch (_) {
            }
        }
        this.logger.log(`News sync complete: ${synced}/${articles.length} new articles`);
        return { synced, total: articles.length };
    }
    async fetchArticles(apiKey, apiUrl) {
        try {
            const res = await (0, rxjs_1.firstValueFrom)(this.http.get(`${apiUrl}/top-headlines`, {
                params: { category: 'sports', language: 'en', pageSize: 20, apiKey },
            }));
            return res.data?.articles || [];
        }
        catch {
        }
        try {
            const res = await (0, rxjs_1.firstValueFrom)(this.http.get(`${apiUrl}/everything`, {
                params: {
                    q: 'football OR soccer',
                    language: 'en',
                    sortBy: 'publishedAt',
                    pageSize: 20,
                    apiKey,
                },
            }));
            return res.data?.articles || [];
        }
        catch (e) {
            this.logger.error(`NewsAPI fetch failed: ${e.message}`);
            return [];
        }
    }
};
exports.NewsSyncService = NewsSyncService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NewsSyncService.prototype, "syncNews", null);
exports.NewsSyncService = NewsSyncService = NewsSyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        axios_1.HttpService,
        config_1.ConfigService])
], NewsSyncService);
//# sourceMappingURL=news-sync.service.js.map