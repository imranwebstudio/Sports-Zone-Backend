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
exports.AdvertisementsService = exports.CreateAdDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
class CreateAdDto {
    name;
    slot;
    network;
    code;
    isActive;
    position;
    page;
}
exports.CreateAdDto = CreateAdDto;
let AdvertisementsService = class AdvertisementsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.advertisement.findMany({ orderBy: { position: 'asc' } });
    }
    findActive(page) {
        const where = { isActive: true };
        if (page)
            where.OR = [{ page }, { page: null }];
        return this.prisma.advertisement.findMany({
            where,
            orderBy: { position: 'asc' },
        });
    }
    findBySlot(slot) {
        return this.prisma.advertisement.findMany({
            where: { slot, isActive: true },
            orderBy: { position: 'asc' },
        });
    }
    create(dto) {
        return this.prisma.advertisement.create({ data: dto });
    }
    async update(id, dto) {
        await this.prisma.advertisement.findUniqueOrThrow({ where: { id } });
        return this.prisma.advertisement.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.prisma.advertisement.findUniqueOrThrow({ where: { id } });
        return this.prisma.advertisement.delete({ where: { id } });
    }
    async toggle(id) {
        const ad = await this.prisma.advertisement.findUniqueOrThrow({ where: { id } });
        return this.prisma.advertisement.update({
            where: { id },
            data: { isActive: !ad.isActive },
        });
    }
};
exports.AdvertisementsService = AdvertisementsService;
exports.AdvertisementsService = AdvertisementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdvertisementsService);
//# sourceMappingURL=advertisements.service.js.map