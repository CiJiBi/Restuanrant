import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { IGenericRepository } from "../../../core/base/repository.interface";

@Injectable()
export class MenuRepository implements IGenericRepository<any> {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: { search?: string; skip?: number; take?: number }) {
    const { search, skip = 0, take = 10 } = params || {};
    return this.prisma.menuItem.findMany({
      where: search ? { name: { contains: search } } : { isDeleted: false },
      skip: Number(skip),
      take: Number(take),
      include: { category: true }, // Lấy luôn thông tin danh mục
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return this.prisma.menuItem.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async create(data: any) {
    return this.prisma.menuItem.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.menuItem.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.menuItem.delete({ where: { id } });
    return true;
  }

  async softDelete(id: string): Promise<boolean> {
    await this.prisma.menuItem.update({
      where: { id },
      data: { isDeleted: true, status: "INACTIVE" },
    });
    return true;
  }
}
