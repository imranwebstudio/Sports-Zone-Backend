import { PrismaService } from '../../prisma/prisma.service';
import { CreateArticleDto, UpdateArticleDto, ArticleQueryDto } from './dto/article.dto';
export declare class ArticlesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: ArticleQueryDto, adminView?: boolean): Promise<{
        items: ({
            category: {
                name: string;
                slug: string;
                color: string | null;
            };
            author: {
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tags: string[];
            slug: string;
            title: string;
            excerpt: string | null;
            content: string;
            featuredImage: string | null;
            categoryId: string;
            status: import("@prisma/client").$Enums.ArticleStatus;
            isBreaking: boolean;
            isTrending: boolean;
            isFeatured: boolean;
            readTime: number;
            metaTitle: string | null;
            metaDescription: string | null;
            scheduledAt: Date | null;
            authorId: string;
            viewCount: number;
            publishedAt: Date | null;
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(slug: string, incrementView?: boolean): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            slug: string;
            color: string | null;
            icon: string | null;
            sortOrder: number;
            isActive: boolean;
        };
        author: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        slug: string;
        title: string;
        excerpt: string | null;
        content: string;
        featuredImage: string | null;
        categoryId: string;
        status: import("@prisma/client").$Enums.ArticleStatus;
        isBreaking: boolean;
        isTrending: boolean;
        isFeatured: boolean;
        readTime: number;
        metaTitle: string | null;
        metaDescription: string | null;
        scheduledAt: Date | null;
        authorId: string;
        viewCount: number;
        publishedAt: Date | null;
    }>;
    findRelated(articleId: string, categoryId: string, limit?: number): Promise<({
        category: {
            name: string;
            slug: string;
            color: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        slug: string;
        title: string;
        excerpt: string | null;
        content: string;
        featuredImage: string | null;
        categoryId: string;
        status: import("@prisma/client").$Enums.ArticleStatus;
        isBreaking: boolean;
        isTrending: boolean;
        isFeatured: boolean;
        readTime: number;
        metaTitle: string | null;
        metaDescription: string | null;
        scheduledAt: Date | null;
        authorId: string;
        viewCount: number;
        publishedAt: Date | null;
    })[]>;
    findTrending(limit?: number): Promise<({
        category: {
            name: string;
            slug: string;
            color: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        slug: string;
        title: string;
        excerpt: string | null;
        content: string;
        featuredImage: string | null;
        categoryId: string;
        status: import("@prisma/client").$Enums.ArticleStatus;
        isBreaking: boolean;
        isTrending: boolean;
        isFeatured: boolean;
        readTime: number;
        metaTitle: string | null;
        metaDescription: string | null;
        scheduledAt: Date | null;
        authorId: string;
        viewCount: number;
        publishedAt: Date | null;
    })[]>;
    findBreaking(limit?: number): Promise<({
        category: {
            name: string;
            slug: string;
            color: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        slug: string;
        title: string;
        excerpt: string | null;
        content: string;
        featuredImage: string | null;
        categoryId: string;
        status: import("@prisma/client").$Enums.ArticleStatus;
        isBreaking: boolean;
        isTrending: boolean;
        isFeatured: boolean;
        readTime: number;
        metaTitle: string | null;
        metaDescription: string | null;
        scheduledAt: Date | null;
        authorId: string;
        viewCount: number;
        publishedAt: Date | null;
    })[]>;
    findFeatured(limit?: number): Promise<({
        category: {
            name: string;
            slug: string;
            color: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        slug: string;
        title: string;
        excerpt: string | null;
        content: string;
        featuredImage: string | null;
        categoryId: string;
        status: import("@prisma/client").$Enums.ArticleStatus;
        isBreaking: boolean;
        isTrending: boolean;
        isFeatured: boolean;
        readTime: number;
        metaTitle: string | null;
        metaDescription: string | null;
        scheduledAt: Date | null;
        authorId: string;
        viewCount: number;
        publishedAt: Date | null;
    })[]>;
    create(dto: CreateArticleDto, authorId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        slug: string;
        title: string;
        excerpt: string | null;
        content: string;
        featuredImage: string | null;
        categoryId: string;
        status: import("@prisma/client").$Enums.ArticleStatus;
        isBreaking: boolean;
        isTrending: boolean;
        isFeatured: boolean;
        readTime: number;
        metaTitle: string | null;
        metaDescription: string | null;
        scheduledAt: Date | null;
        authorId: string;
        viewCount: number;
        publishedAt: Date | null;
    }>;
    update(id: string, dto: UpdateArticleDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        slug: string;
        title: string;
        excerpt: string | null;
        content: string;
        featuredImage: string | null;
        categoryId: string;
        status: import("@prisma/client").$Enums.ArticleStatus;
        isBreaking: boolean;
        isTrending: boolean;
        isFeatured: boolean;
        readTime: number;
        metaTitle: string | null;
        metaDescription: string | null;
        scheduledAt: Date | null;
        authorId: string;
        viewCount: number;
        publishedAt: Date | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        slug: string;
        title: string;
        excerpt: string | null;
        content: string;
        featuredImage: string | null;
        categoryId: string;
        status: import("@prisma/client").$Enums.ArticleStatus;
        isBreaking: boolean;
        isTrending: boolean;
        isFeatured: boolean;
        readTime: number;
        metaTitle: string | null;
        metaDescription: string | null;
        scheduledAt: Date | null;
        authorId: string;
        viewCount: number;
        publishedAt: Date | null;
    }>;
    getStats(): Promise<{
        total: number;
        published: number;
        draft: number;
        trending: number;
        breaking: number;
    }>;
}
