import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.setting.findMany({ orderBy: { group: 'asc' } });
  }

  async get(key: string) {
    const setting = await this.prisma.setting.findUnique({ where: { key } });
    return setting?.value ?? null;
  }

  async set(key: string, value: string, group = 'general') {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value, group },
    });
  }

  async setMany(items: { key: string; value: string; group?: string }[]) {
    return Promise.all(items.map((i) => this.set(i.key, i.value, i.group)));
  }
}
