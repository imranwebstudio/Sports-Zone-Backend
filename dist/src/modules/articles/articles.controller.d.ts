import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto, ArticleQueryDto } from './dto/article.dto';
export declare class ArticlesController {
    private readonly svc;
    constructor(svc: ArticlesService);
    findAll(query: ArticleQueryDto): Promise<{
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
    findTrending(limit: string): Promise<({
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
    findBreaking(limit: string): Promise<({
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
    findFeatured(limit: string): Promise<({
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
    getStats(): Promise<{
        total: number;
        published: number;
        draft: number;
        trending: number;
        breaking: number;
    }>;
    findAllAdmin(query: ArticleQueryDto): Promise<{
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
    findOne(slug: string): Promise<{
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
    create(dto: CreateArticleDto, req: any): Promise<{
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
}
