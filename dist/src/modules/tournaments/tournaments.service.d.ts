import { PrismaService } from '../../prisma/prisma.service';
export declare class CreateTournamentDto {
    name: string;
    slug: string;
    logo?: string;
    country?: string;
    sport?: string;
    sortOrder?: number;
}
export declare class TournamentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        _count: {
            matches: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        slug: string;
        sortOrder: number;
        isActive: boolean;
        logo: string | null;
        country: string | null;
        sport: string;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__TournamentClient<{
        id: string;
        name: string;
        createdAt: Date;
        slug: string;
        sortOrder: number;
        isActive: boolean;
        logo: string | null;
        country: string | null;
        sport: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(dto: CreateTournamentDto): import("@prisma/client").Prisma.Prisma__TournamentClient<{
        id: string;
        name: string;
        createdAt: Date;
        slug: string;
        sortOrder: number;
        isActive: boolean;
        logo: string | null;
        country: string | null;
        sport: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: Partial<CreateTournamentDto> & {
        isActive?: boolean;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        slug: string;
        sortOrder: number;
        isActive: boolean;
        logo: string | null;
        country: string | null;
        sport: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        slug: string;
        sortOrder: number;
        isActive: boolean;
        logo: string | null;
        country: string | null;
        sport: string;
    }>;
}
