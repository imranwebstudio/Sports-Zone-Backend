import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly svc;
    constructor(svc: SettingsService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
        group: string;
    }[]>;
    get(key: string): Promise<string | null>;
    set(body: {
        key: string;
        value: string;
        group?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
        group: string;
    }>;
    setMany(body: {
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
