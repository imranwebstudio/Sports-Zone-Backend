"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const serve_static_1 = require("@nestjs/serve-static");
const schedule_1 = require("@nestjs/schedule");
const path_1 = require("path");
const configuration_1 = __importDefault(require("./config/configuration"));
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const categories_module_1 = require("./modules/categories/categories.module");
const articles_module_1 = require("./modules/articles/articles.module");
const matches_module_1 = require("./modules/matches/matches.module");
const channels_module_1 = require("./modules/channels/channels.module");
const teams_module_1 = require("./modules/teams/teams.module");
const tournaments_module_1 = require("./modules/tournaments/tournaments.module");
const advertisements_module_1 = require("./modules/advertisements/advertisements.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const settings_module_1 = require("./modules/settings/settings.module");
const upload_module_1 = require("./modules/upload/upload.module");
const news_sync_module_1 = require("./modules/news-sync/news-sync.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, load: [configuration_1.default] }),
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 100 }] }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            categories_module_1.CategoriesModule,
            articles_module_1.ArticlesModule,
            matches_module_1.MatchesModule,
            channels_module_1.ChannelsModule,
            teams_module_1.TeamsModule,
            tournaments_module_1.TournamentsModule,
            advertisements_module_1.AdvertisementsModule,
            analytics_module_1.AnalyticsModule,
            settings_module_1.SettingsModule,
            upload_module_1.UploadModule,
            news_sync_module_1.NewsSyncModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map