import { PrismaService } from '../../prisma/prisma.service';
export declare class CreateTeamDto {
    name: string;
    slug: string;
    logo?: string;
    country?: string;
    sport?: string;
}
export declare class TeamsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(search?: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        slug: string;
        logo: string | null;
        country: string | null;
        sport: string;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__TeamClient<{
        id: string;
        name: string;
        createdAt: Date;
        slug: string;
        logo: string | null;
        country: string | null;
        sport: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(dto: CreateTeamDto): import("@prisma/client").Prisma.Prisma__TeamClient<{
        id: string;
        name: string;
        createdAt: Date;
        slug: string;
        logo: string | null;
        country: string | null;
        sport: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: Partial<CreateTeamDto>): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        slug: string;
        logo: string | null;
        country: string | null;
        sport: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        slug: string;
        logo: string | null;
        country: string | null;
        sport: string;
    }>;
}
