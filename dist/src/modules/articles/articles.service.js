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
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let ArticlesService = class ArticlesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query, adminView = false) {
        const page = parseInt(query.page || '1', 10);
        const limit = parseInt(query.limit || '12', 10);
        const skip = (page - 1) * limit;
        const where = {};
        if (!adminView)
            where.status = client_1.ArticleStatus.PUBLISHED;
        if (query.status && adminView)
            where.status = query.status;
        if (query.category) {
            where.category = { slug: query.category };
        }
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { excerpt: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const [total, items] = await Promise.all([
            this.prisma.article.count({ where }),
            this.prisma.article.findMany({
                where,
                skip,
                take: limit,
                orderBy: { publishedAt: 'desc' },
                include: {
                    category: { select: { name: true, slug: true, color: true } },
                    author: { select: { name: true } },
                },
            }),
        ]);
        return { items, total, page, limit, pages: Math.ceil(total / limit) };
    }
    async findOne(slug, incrementView = true) {
        const article = await this.prisma.article.findUnique({
            where: { slug },
            include: {
                category: true,
                author: { select: { name: true, id: true } },
            },
        });
        if (!article)
            throw new common_1.NotFoundException('Article not found');
        if (incrementView) {
            await this.prisma.article.update({
                where: { slug },
                data: { viewCount: { increment: 1 } },
            });
        }
        return article;
    }
    async findRelated(articleId, categoryId, limit = 4) {
        return this.prisma.article.findMany({
            where: {
                id: { not: articleId },
                categoryId,
                status: client_1.ArticleStatus.PUBLISHED,
            },
            take: limit,
            orderBy: { publishedAt: 'desc' },
            include: { category: { select: { name: true, slug: true, color: true } } },
        });
    }
    async findTrending(limit = 6) {
        return this.prisma.article.findMany({
            where: { isTrending: true, status: client_1.ArticleStatus.PUBLISHED },
            take: limit,
            orderBy: { viewCount: 'desc' },
            include: { category: { select: { name: true, slug: true, color: true } } },
        });
    }
    async findBreaking(limit = 5) {
        return this.prisma.article.findMany({
            where: { isBreaking: true, status: client_1.ArticleStatus.PUBLISHED },
            take: limit,
            orderBy: { publishedAt: 'desc' },
            include: { category: { select: { name: true, slug: true, color: true } } },
        });
    }
    async findFeatured(limit = 4) {
        return this.prisma.article.findMany({
            where: { isFeatured: true, status: client_1.ArticleStatus.PUBLISHED },
            take: limit,
            orderBy: { publishedAt: 'desc' },
            include: { category: { select: { name: true, slug: true, color: true } } },
        });
    }
    async create(dto, authorId) {
        const publishedAt = dto.status === client_1.ArticleStatus.PUBLISHED ? new Date() : undefined;
        return this.prisma.article.create({
            data: {
                ...dto,
                authorId,
                publishedAt,
                scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
            },
        });
    }
    async update(id, dto) {
        const existing = await this.prisma.article.findUniqueOrThrow({ where: { id } });
        const publishedAt = dto.status === client_1.ArticleStatus.PUBLISHED && !existing.publishedAt
            ? new Date()
            : undefined;
        return this.prisma.article.update({
            where: { id },
            data: {
                ...dto,
                ...(publishedAt ? { publishedAt } : {}),
                scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
            },
        });
    }
    async remove(id) {
        await this.prisma.article.findUniqueOrThrow({ where: { id } });
        return this.prisma.article.delete({ where: { id } });
    }
    async getStats() {
        const [total, published, draft, trending, breaking] = await Promise.all([
            this.prisma.article.count(),
            this.prisma.article.count({ where: { status: 'PUBLISHED' } }),
            this.prisma.article.count({ where: { status: 'DRAFT' } }),
            this.prisma.article.count({ where: { isTrending: true } }),
            this.prisma.article.count({ where: { isBreaking: true } }),
        ]);
        return { total, published, draft, trending, breaking };
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map