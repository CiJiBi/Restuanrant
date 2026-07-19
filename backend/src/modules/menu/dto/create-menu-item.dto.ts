// src/modules/menu/dto/create-menu-item.dto.ts
import { IsString, IsNumber, IsOptional, Min, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMenuItemDto {
  @ApiProperty({ example: "MN001" })
  @IsString()
  itemCode: string;

  @ApiProperty({ example: "Thịt bò Wagyu" })
  @IsString()
  name: string;

  @ApiProperty({ example: 1250000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: "https://img.url", required: false })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  categoryId: number;
}
