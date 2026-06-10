import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        _count: {
            articles: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        slug: string;
        color: string | null;
        icon: string | null;
        sortOrder: number;
        isActive: boolean;
    })[]>;
    findOne(slug: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        slug: string;
        color: string | null;
        icon: string | null;
        sortOrder: number;
        isActive: boolean;
    }>;
    create(dto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        slug: string;
        color: string | null;
        icon: string | null;
        sortOrder: number;
        isActive: boolean;
    }>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        slug: string;
        color: string | null;
        icon: string | null;
        sortOrder: number;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        slug: string;
        color: string | null;
        icon: string | null;
        sortOrder: number;
        isActive: boolean;
    }>;
}
