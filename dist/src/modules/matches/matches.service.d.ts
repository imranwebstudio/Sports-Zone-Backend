import { PrismaService } from '../../prisma/prisma.service';
import { CreateMatchDto, UpdateMatchDto, MatchQueryDto } from './dto/match.dto';
export declare class MatchesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: MatchQueryDto): Promise<{
        items: ({
            tournament: {
                id: string;
                name: string;
                logo: string | null;
            };
            homeTeam: {
                id: string;
                name: string;
                logo: string | null;
                country: string | null;
            };
            awayTeam: {
                id: string;
                name: string;
                logo: string | null;
                country: string | null;
            };
            channels: {
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
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            minute: number | null;
            slug: string;
            isActive: boolean;
            title: string;
            status: import("@prisma/client").$Enums.MatchStatus;
            isFeatured: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            viewCount: number;
            homeTeamId: string;
            awayTeamId: string;
            tournamentId: string;
            matchTime: Date;
            homeScore: number | null;
            awayScore: number | null;
            banner: string | null;
            destinationType: import("@prisma/client").$Enums.DestinationType;
            externalUrl: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findLive(): Promise<({
        tournament: {
            id: string;
            name: string;
            logo: string | null;
        };
        homeTeam: {
            id: string;
            name: string;
            logo: string | null;
            country: string | null;
        };
        awayTeam: {
            id: string;
            name: string;
            logo: string | null;
            country: string | null;
        };
        channels: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        minute: number | null;
        slug: string;
        isActive: boolean;
        title: string;
        status: import("@prisma/client").$Enums.MatchStatus;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        viewCount: number;
        homeTeamId: string;
        awayTeamId: string;
        tournamentId: string;
        matchTime: Date;
        homeScore: number | null;
        awayScore: number | null;
        banner: string | null;
        destinationType: import("@prisma/client").$Enums.DestinationType;
        externalUrl: string | null;
    })[]>;
    findFeatured(): Promise<({
        tournament: {
            id: string;
            name: string;
            logo: string | null;
        };
        homeTeam: {
            id: string;
            name: string;
            logo: string | null;
            country: string | null;
        };
        awayTeam: {
            id: string;
            name: string;
            logo: string | null;
            country: string | null;
        };
        channels: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        minute: number | null;
        slug: string;
        isActive: boolean;
        title: string;
        status: import("@prisma/client").$Enums.MatchStatus;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        viewCount: number;
        homeTeamId: string;
        awayTeamId: string;
        tournamentId: string;
        matchTime: Date;
        homeScore: number | null;
        awayScore: number | null;
        banner: string | null;
        destinationType: import("@prisma/client").$Enums.DestinationType;
        externalUrl: string | null;
    })[]>;
    findOne(slug: string): Promise<{
        tournament: {
            id: string;
            name: string;
            logo: string | null;
        };
        homeTeam: {
            id: string;
            name: string;
            logo: string | null;
            country: string | null;
        };
        awayTeam: {
            id: string;
            name: string;
            logo: string | null;
            country: string | null;
        };
        channels: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        minute: number | null;
        slug: string;
        isActive: boolean;
        title: string;
        status: import("@prisma/client").$Enums.MatchStatus;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        viewCount: number;
        homeTeamId: string;
        awayTeamId: string;
        tournamentId: string;
        matchTime: Date;
        homeScore: number | null;
        awayScore: number | null;
        banner: string | null;
        destinationType: import("@prisma/client").$Enums.DestinationType;
        externalUrl: string | null;
    }>;
    create(dto: CreateMatchDto): Promise<{
        tournament: {
            id: string;
            name: string;
            logo: string | null;
        };
        homeTeam: {
            id: string;
            name: string;
            logo: string | null;
            country: string | null;
        };
        awayTeam: {
            id: string;
            name: string;
            logo: string | null;
            country: string | null;
        };
        channels: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        minute: number | null;
        slug: string;
        isActive: boolean;
        title: string;
        status: import("@prisma/client").$Enums.MatchStatus;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        viewCount: number;
        homeTeamId: string;
        awayTeamId: string;
        tournamentId: string;
        matchTime: Date;
        homeScore: number | null;
        awayScore: number | null;
        banner: string | null;
        destinationType: import("@prisma/client").$Enums.DestinationType;
        externalUrl: string | null;
    }>;
    update(id: string, dto: UpdateMatchDto): Promise<{
        tournament: {
            id: string;
            name: string;
            logo: string | null;
        };
        homeTeam: {
            id: string;
            name: string;
            logo: string | null;
            country: string | null;
        };
        awayTeam: {
            id: string;
            name: string;
            logo: string | null;
            country: string | null;
        };
        channels: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        minute: number | null;
        slug: string;
        isActive: boolean;
        title: string;
        status: import("@prisma/client").$Enums.MatchStatus;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        viewCount: number;
        homeTeamId: string;
        awayTeamId: string;
        tournamentId: string;
        matchTime: Date;
        homeScore: number | null;
        awayScore: number | null;
        banner: string | null;
        destinationType: import("@prisma/client").$Enums.DestinationType;
        externalUrl: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        minute: number | null;
        slug: string;
        isActive: boolean;
        title: string;
        status: import("@prisma/client").$Enums.MatchStatus;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        viewCount: number;
        homeTeamId: string;
        awayTeamId: string;
        tournamentId: string;
        matchTime: Date;
        homeScore: number | null;
        awayScore: number | null;
        banner: string | null;
        destinationType: import("@prisma/client").$Enums.DestinationType;
        externalUrl: string | null;
    }>;
    getStats(): Promise<{
        total: number;
        live: number;
        upcoming: number;
        finished: number;
    }>;
}
