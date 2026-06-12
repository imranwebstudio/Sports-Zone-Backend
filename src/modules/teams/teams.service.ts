import { Injectable } from '@nestjs/common';
import { IsString, IsOptional } from 'class-validator';
import { PrismaService } from '../../prisma/prisma.service';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  sport?: string;
}

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(search?: string) {
    return this.prisma.team.findMany({
      where: search
        ? { name: { contains: search, mode: 'insensitive' } }
        : undefined,
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.team.findUniqueOrThrow({ where: { id } });
  }

  create(dto: CreateTeamDto) {
    return this.prisma.team.create({ data: dto });
  }

  async update(id: string, dto: Partial<CreateTeamDto>) {
    await this.prisma.team.findUniqueOrThrow({ where: { id } });
    return this.prisma.team.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.team.findUniqueOrThrow({ where: { id } });
    return this.prisma.team.delete({ where: { id } });
  }
}
