"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsSyncModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const prisma_module_1 = require("../../prisma/prisma.module");
const news_sync_service_1 = require("./news-sync.service");
const news_sync_controller_1 = require("./news-sync.controller");
let NewsSyncModule = class NewsSyncModule {
};
exports.NewsSyncModule = NewsSyncModule;
exports.NewsSyncModule = NewsSyncModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule, prisma_module_1.PrismaModule],
        providers: [news_sync_service_1.NewsSyncService],
        controllers: [news_sync_controller_1.NewsSyncController],
    })
], NewsSyncModule);
//# sourceMappingURL=news-sync.module.js.map