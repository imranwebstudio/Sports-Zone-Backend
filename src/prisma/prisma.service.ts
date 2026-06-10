import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Prisma v7: `url` is removed from schema.prisma; the connection URL is instead
// passed at client construction time via the PrismaPg driver adapter.
// The IDE Prisma extension may show a false "url missing" error on schema.prisma —
// `npx prisma validate` confirms the schema is valid.
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({ adapter: new PrismaPg(process.env.DATABASE_URL!) });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
