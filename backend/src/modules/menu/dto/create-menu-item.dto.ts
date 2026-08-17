import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  IsInt,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateMenuItemDto {
  @ApiProperty({ example: "SP001", description: "Mã sản phẩm duy nhất" })
  @IsString()
  itemCode!: string;

  @ApiProperty({ example: "Cà phê Sữa đá", description: "Tên món ăn/đồ uống" })
  @IsString()
  name!: string;

  @ApiProperty({ example: 25000, description: "Giá bán" })
  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: "Giá bán phải lớn hơn 0!" })
  price!: number;

  @ApiProperty({ example: 1, description: "ID của danh mục (Category)" })
  @IsInt()
  @Type(() => Number)
  categoryId!: number;

  @ApiProperty({
    required: false,
    example: true,
    description: "Trạng thái phục vụ",
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({
    required: false,
    example: "https://example.com/image.jpg",
    description: "Link ảnh sản phẩm",
  })
  @IsOptional()
  @IsString() // Đã đổi từ IsUrl sang IsString để cho phép để trống hoặc nhập linh hoạt
  imageUrl?: string;
}
