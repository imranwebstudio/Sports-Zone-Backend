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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertisementsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const advertisements_service_1 = require("./advertisements.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const client_1 = require("@prisma/client");
let AdvertisementsController = class AdvertisementsController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    findActive(page) { return this.svc.findActive(page); }
    findBySlot(slot) { return this.svc.findBySlot(slot); }
    findAll() { return this.svc.findAll(); }
    create(dto) { return this.svc.create(dto); }
    toggle(id) { return this.svc.toggle(id); }
    update(id, dto) {
        return this.svc.update(id, dto);
    }
    remove(id) { return this.svc.remove(id); }
};
exports.AdvertisementsController = AdvertisementsController;
__decorate([
    (0, common_1.Get)('active'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdvertisementsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('slot/:slot'),
    __param(0, (0, common_1.Param)('slot')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdvertisementsController.prototype, "findBySlot", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdvertisementsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [advertisements_service_1.CreateAdDto]),
    __metadata("design:returntype", void 0)
], AdvertisementsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/toggle'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdvertisementsController.prototype, "toggle", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdvertisementsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdvertisementsController.prototype, "remove", null);
exports.AdvertisementsController = AdvertisementsController = __decorate([
    (0, swagger_1.ApiTags)('Advertisements'),
    (0, common_1.Controller)('advertisements'),
    __metadata("design:paramtypes", [advertisements_service_1.AdvertisementsService])
], AdvertisementsController);
//# sourceMappingURL=advertisements.controller.js.map