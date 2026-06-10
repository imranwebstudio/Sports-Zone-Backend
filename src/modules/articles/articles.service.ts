import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateArticleDto, UpdateArticleDto, ArticleQueryDto } from './dto/article.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ArticleQueryDto, adminView = false) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '12', 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (!adminView) where.status = ArticleStatus.PUBLISHED;
    if (query.status && adminView) where.status = query.status;
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

  async findOne(slug: string, incrementView = true) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        category: true,
        author: { select: { name: true, id: true } },
      },
    });
    if (!article) throw new NotFoundException('Article not found');

    if (incrementView) {
      await this.prisma.article.update({
        where: { slug },
        data: { viewCount: { increment: 1 } },
      });
    }

    return article;
  }

  async findRelated(articleId: string, categoryId: string, limit = 4) {
    return this.prisma.article.findMany({
      where: {
        id: { not: articleId },
        categoryId,
        status: ArticleStatus.PUBLISHED,
      },
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: { category: { select: { name: true, slug: true, color: true } } },
    });
  }

  async findTrending(limit = 6) {
    return this.prisma.article.findMany({
      where: { isTrending: true, status: ArticleStatus.PUBLISHED },
      take: limit,
      orderBy: { viewCount: 'desc' },
      include: { category: { select: { name: true, slug: true, color: true } } },
    });
  }

  async findBreaking(limit = 5) {
    return this.prisma.article.findMany({
      where: { isBreaking: true, status: ArticleStatus.PUBLISHED },
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: { category: { select: { name: true, slug: true, color: true } } },
    });
  }

  async findFeatured(limit = 4) {
    return this.prisma.article.findMany({
      where: { isFeatured: true, status: ArticleStatus.PUBLISHED },
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: { category: { select: { name: true, slug: true, color: true } } },
    });
  }

  async create(dto: CreateArticleDto, authorId: string) {
    const publishedAt =
      dto.status === ArticleStatus.PUBLISHED ? new Date() : undefined;
    return this.prisma.article.create({
      data: {
        ...dto,
        authorId,
        publishedAt,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      },
    });
  }

  async update(id: string, dto: UpdateArticleDto) {
    const existing = await this.prisma.article.findUniqueOrThrow({ where: { id } });
    const publishedAt =
      dto.status === ArticleStatus.PUBLISHED && !existing.publishedAt
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

  async remove(id: string) {
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
}
