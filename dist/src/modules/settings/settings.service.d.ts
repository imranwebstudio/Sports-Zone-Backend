import { PrismaService } from '../../prisma/prisma.service';
export declare class SettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
        group: string;
    }[]>;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, group?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
        group: string;
    }>;
    setMany(items: {
        key: string;
        value: string;
        group?: string;
    }[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
        group: string;
    }[]>;
}
