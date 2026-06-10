import { ArticleStatus } from '@prisma/client';
export declare class CreateArticleDto {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featuredImage?: string;
    categoryId: string;
    status?: ArticleStatus;
    isBreaking?: boolean;
    isTrending?: boolean;
    isFeatured?: boolean;
    readTime?: number;
    tags?: string[];
    metaTitle?: string;
    metaDescription?: string;
    scheduledAt?: string;
}
export declare class UpdateArticleDto extends CreateArticleDto {
}
export declare class ArticleQueryDto {
    page?: string;
    limit?: string;
    category?: string;
    status?: ArticleStatus;
    search?: string;
}
