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
exports.TeamsService = exports.CreateTeamDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
class CreateTeamDto {
    name;
    slug;
    logo;
    country;
    sport;
}
exports.CreateTeamDto = CreateTeamDto;
let TeamsService = class TeamsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(search) {
        return this.prisma.team.findMany({
            where: search
                ? { name: { contains: search, mode: 'insensitive' } }
                : undefined,
            orderBy: { name: 'asc' },
        });
    }
    findOne(id) {
        return this.prisma.team.findUniqueOrThrow({ where: { id } });
    }
    create(dto) {
        return this.prisma.team.create({ data: dto });
    }
    async update(id, dto) {
        await this.prisma.team.findUniqueOrThrow({ where: { id } });
        return this.prisma.team.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.prisma.team.findUniqueOrThrow({ where: { id } });
        return this.prisma.team.delete({ where: { id } });
    }
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeamsService);
//# sourceMappingURL=teams.service.js.map