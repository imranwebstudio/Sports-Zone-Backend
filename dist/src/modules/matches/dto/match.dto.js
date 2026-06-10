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
exports.MatchQueryDto = exports.UpdateMatchDto = exports.CreateMatchDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateMatchDto {
    title;
    slug;
    homeTeamId;
    awayTeamId;
    tournamentId;
    matchTime;
    status;
    homeScore;
    awayScore;
    minute;
    banner;
    isFeatured;
    isActive;
    destinationType;
    externalUrl;
    metaTitle;
    metaDescription;
}
exports.CreateMatchDto = CreateMatchDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "homeTeamId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "awayTeamId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "tournamentId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "matchTime", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.MatchStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMatchDto.prototype, "homeScore", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMatchDto.prototype, "awayScore", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMatchDto.prototype, "minute", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "banner", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateMatchDto.prototype, "isFeatured", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateMatchDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.DestinationType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "destinationType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "externalUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "metaTitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "metaDescription", void 0);
class UpdateMatchDto extends CreateMatchDto {
}
exports.UpdateMatchDto = UpdateMatchDto;
class MatchQueryDto {
    page;
    limit;
    status;
    tournamentId;
}
exports.MatchQueryDto = MatchQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MatchQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MatchQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MatchQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MatchQueryDto.prototype, "tournamentId", void 0);
//# sourceMappingURL=match.dto.js.map