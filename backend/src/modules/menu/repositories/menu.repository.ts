// src/modules/menu/repositories/menu.repository.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IGenericRepository } from "src/core/base/repository.interface";
import { MenuItem, Prisma } from "@prisma/client";

@Injectable()
export class MenuRepository implements IGenericRepository<MenuItem> {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
  }): Promise<any> {
    const { skip = 0, take = 10, search } = params;
    const where: Prisma.MenuItemWhereInput = { isDeleted: false };

    if (search) {
      where.name = { contains: search };
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.menuItem.findMany({
        where,
        skip,
        take,
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.menuItem.count({ where }),
    ]);

    return { items, meta: { total, skip, take } };
  }

  async findById(id: string): Promise<MenuItem> {
    return this.prisma.menuItem.findFirst({ where: { id, isDeleted: false } });
  }

  async create(data: Prisma.MenuItemCreateInput): Promise<MenuItem> {
    return this.prisma.menuItem.create({ data });
  }

  async update(
    id: string,
    data: Prisma.MenuItemUpdateInput,
  ): Promise<MenuItem> {
    return this.prisma.menuItem.update({ where: { id }, data });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.menuItem.delete({ where: { id } });
    return true;
  }

  async softDelete(id: string): Promise<boolean> {
    await this.prisma.menuItem.update({
      where: { id },
      data: { isDeleted: true, status: "Ngừng bán" },
    });
    return true;
  }
}
