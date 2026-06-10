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
exports.TournamentsService = exports.CreateTournamentDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
class CreateTournamentDto {
    name;
    slug;
    logo;
    country;
    sport;
    sortOrder;
}
exports.CreateTournamentDto = CreateTournamentDto;
let TournamentsService = class TournamentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.tournament.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
            include: { _count: { select: { matches: true } } },
        });
    }
    findOne(id) {
        return this.prisma.tournament.findUniqueOrThrow({ where: { id } });
    }
    create(dto) {
        return this.prisma.tournament.create({ data: dto });
    }
    async update(id, dto) {
        await this.prisma.tournament.findUniqueOrThrow({ where: { id } });
        return this.prisma.tournament.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.prisma.tournament.findUniqueOrThrow({ where: { id } });
        return this.prisma.tournament.delete({ where: { id } });
    }
};
exports.TournamentsService = TournamentsService;
exports.TournamentsService = TournamentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TournamentsService);
//# sourceMappingURL=tournaments.service.js.map