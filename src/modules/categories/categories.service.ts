import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { articles: true } } },
    });
  }

  async findOne(slug: string) {
    const cat = await this.prisma.category.findUnique({ where: { slug } });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async create(dto: CreateCategoryDto) {
    const exists = await this.prisma.category.findUnique({ where: { slug: dto.slug } });
    if (exists) throw new ConflictException('Slug already in use');
    return this.prisma.category.create({ data: dto });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.prisma.category.findUniqueOrThrow({ where: { id } });
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.category.findUniqueOrThrow({ where: { id } });
    return this.prisma.category.delete({ where: { id } });
  }
}
