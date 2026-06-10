"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const INCLUDE = {
    homeTeam: { select: { id: true, name: true, logo: true, country: true } },
    awayTeam: { select: { id: true, name: true, logo: true, country: true } },
    tournament: { select: { id: true, name: true, logo: true } },
    channels: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
    },
};
let MatchesService = class MatchesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const page = parseInt(query.page || '1', 10);
        const limit = parseInt(query.limit || '20', 10);
        const skip = (page - 1) * limit;
        const where = { isActive: true };
        if (query.status)
            where.status = query.status;
        if (query.tournamentId)
            where.tournamentId = query.tournamentId;
        const [total, items] = await Promise.all([
            this.prisma.match.count({ where }),
            this.prisma.match.findMany({
                where, skip, take: limit,
                orderBy: [{ status: 'asc' }, { matchTime: 'asc' }],
                include: INCLUDE,
            }),
        ]);
        return { items, total, page, limit, pages: Math.ceil(total / limit) };
    }
    async findLive() {
        return this.prisma.match.findMany({
            where: { status: { in: ['LIVE', 'HT'] }, isActive: true },
            orderBy: { matchTime: 'asc' },
            include: INCLUDE,
        });
    }
    async findFeatured() {
        return this.prisma.match.findMany({
            where: { isFeatured: true, isActive: true },
            orderBy: [{ status: 'asc' }, { matchTime: 'asc' }],
            include: INCLUDE,
        });
    }
    async findOne(slug) {
        const match = await this.prisma.match.findUnique({ where: { slug }, include: INCLUDE });
        if (!match)
            throw new common_1.NotFoundException('Match not found');
        await this.prisma.match.update({
            where: { slug },
            data: { viewCount: { increment: 1 } },
        });
        return match;
    }
    async create(dto) {
        return this.prisma.match.create({
            data: { ...dto, matchTime: new Date(dto.matchTime) },
            include: INCLUDE,
        });
    }
    async update(id, dto) {
        await this.prisma.match.findUniqueOrThrow({ where: { id } });
        return this.prisma.match.update({
            where: { id },
            data: { ...dto, matchTime: dto.matchTime ? new Date(dto.matchTime) : undefined },
            include: INCLUDE,
        });
    }
    async remove(id) {
        await this.prisma.match.findUniqueOrThrow({ where: { id } });
        return this.prisma.match.delete({ where: { id } });
    }
    async getStats() {
        const [total, live, upcoming, finished] = await Promise.all([
            this.prisma.match.count(),
            this.prisma.match.count({ where: { status: 'LIVE' } }),
            this.prisma.match.count({ where: { status: 'UPCOMING' } }),
            this.prisma.match.count({ where: { status: 'FINISHED' } }),
        ]);
        return { total, live, upcoming, finished };
    }
};
exports.MatchesService = MatchesService;
exports.MatchesService = MatchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MatchesService);
//# sourceMappingURL=matches.service.js.map