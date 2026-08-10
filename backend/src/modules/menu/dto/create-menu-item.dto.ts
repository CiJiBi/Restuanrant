import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsUrl,
  IsInt,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMenuItemDto {
  @ApiProperty({ example: "SP001", description: "Mã sản phẩm duy nhất" })
  @IsString()
  itemCode!: string;

  @ApiProperty({ example: "Cà phê Sữa đá", description: "Tên món ăn/đồ uống" })
  @IsString()
  name!: string;

  @ApiProperty({ example: 25000, description: "Giá bán" })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: 100, description: "Số lượng tồn kho" })
  @IsInt()
  @Min(0)
  stock!: number;

  @ApiProperty({ example: 1, description: "ID của danh mục (Category)" })
  @IsInt()
  categoryId!: number;

  @ApiProperty({
    required: false,
    example: "https://...",
    description: "Link ảnh sản phẩm",
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
