import { IsInt, Min, IsString, IsOptional } from "class-validator";

export class UpdateTableDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(1, { message: "Số ghế phải ít nhất là 1" }) // Bàn thì không thể có 0 ghế
  @IsOptional()
  capacity?: number;
}
