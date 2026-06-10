import { ChannelsService, CreateChannelDto } from './channels.service';
export declare class ChannelsController {
    private readonly svc;
    constructor(svc: ChannelsService);
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
