import { TournamentsService, CreateTournamentDto } from './tournaments.service';
export declare class TournamentsController {
    private readonly svc;
    constructor(svc: TournamentsService);
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
    update(id: string, dto: any): Promise<{
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
