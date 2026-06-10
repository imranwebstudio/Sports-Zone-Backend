import { Injectable } from '@nestjs/common';
import { AdSlot, AdNetwork } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export class CreateAdDto {
  name: string;
  slot: AdSlot;
  network?: AdNetwork;
  code: string;
  isActive?: boolean;
  position?: number;
  page?: string;
}

@Injectable()
export class AdvertisementsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.advertisement.findMany({ orderBy: { position: 'asc' } });
  }

  findActive(page?: string) {
    const where: any = { isActive: true };
    if (page) where.OR = [{ page }, { page: null }];
    return this.prisma.advertisement.findMany({
      where,
      orderBy: { position: 'asc' },
    });
  }

  findBySlot(slot: AdSlot) {
    return this.prisma.advertisement.findMany({
      where: { slot, isActive: true },
      orderBy: { position: 'asc' },
    });
  }

  create(dto: CreateAdDto) {
    return this.prisma.advertisement.create({ data: dto });
  }

  async update(id: string, dto: Partial<CreateAdDto>) {
    await this.prisma.advertisement.findUniqueOrThrow({ where: { id } });
    return this.prisma.advertisement.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.advertisement.findUniqueOrThrow({ where: { id } });
    return this.prisma.advertisement.delete({ where: { id } });
  }

  async toggle(id: string) {
    const ad = await this.prisma.advertisement.findUniqueOrThrow({ where: { id } });
    return this.prisma.advertisement.update({
      where: { id },
      data: { isActive: !ad.isActive },
    });
  }
}
