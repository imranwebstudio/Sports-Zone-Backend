import { MatchStatus, DestinationType } from '@prisma/client';
export declare class CreateMatchDto {
    title: string;
    slug: string;
    homeTeamId: string;
    awayTeamId: string;
    tournamentId: string;
    matchTime: string;
    status?: MatchStatus;
    homeScore?: number;
    awayScore?: number;
    minute?: number;
    banner?: string;
    isFeatured?: boolean;
    isActive?: boolean;
    destinationType?: DestinationType;
    externalUrl?: string;
    metaTitle?: string;
    metaDescription?: string;
}
export declare class UpdateMatchDto extends CreateMatchDto {
}
export declare class MatchQueryDto {
    page?: string;
    limit?: string;
    status?: MatchStatus;
    tournamentId?: string;
}
