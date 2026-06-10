import { PrismaService } from '../../prisma/prisma.service';
export declare class CreateChannelDto {
    matchId: string;
    name: string;
    language?: string;
    logo?: string;
    thumbnail?: string;
    destinationUrl: string;
    isActive?: boolean;
    sortOrder?: number;
}
export declare class ChannelsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByMatch(matchId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        isActive: boolean;
        logo: string | null;
        matchId: string;
        language: string;
        thumbnail: string | null;
        destinationUrl: string;
    }[]>;
    create(dto: CreateChannelDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        isActive: boolean;
        logo: string | null;
        matchId: string;
        language: string;
        thumbnail: string | null;
        destinationUrl: string;
    }>;
    update(id: string, dto: Partial<CreateChannelDto>): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        isActive: boolean;
        logo: string | null;
        matchId: string;
        language: string;
        thumbnail: string | null;
        destinationUrl: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        isActive: boolean;
        logo: string | null;
        matchId: string;
        language: string;
        thumbnail: string | null;
        destinationUrl: string;
    }>;
}
