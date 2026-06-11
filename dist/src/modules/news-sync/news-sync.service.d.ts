import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../../prisma/prisma.service';
export declare class NewsSyncService implements OnModuleInit {
    private readonly prisma;
    private readonly http;
    private readonly config;
    private readonly logger;
    private authorId;
    private categoryId;
    constructor(prisma: PrismaService, http: HttpService, config: ConfigService);
    onModuleInit(): Promise<void>;
    private ensureResources;
    syncNews(): Promise<{
        synced: number;
        total: number;
    }>;
    private fetchArticles;
}
