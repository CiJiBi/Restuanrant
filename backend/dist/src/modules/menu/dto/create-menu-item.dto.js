"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMenuItemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CreateMenuItemDto {
}
exports.CreateMenuItemDto = CreateMenuItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "SP001", description: "Mã sản phẩm duy nhất" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "itemCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Cà phê Sữa đá", description: "Tên món ăn/đồ uống" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25000, description: "Giá bán" }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1, { message: "Giá bán phải lớn hơn 0!" }),
    __metadata("design:type", Number)
], CreateMenuItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: "ID của danh mục (Category)" }),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateMenuItemDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        example: true,
        description: "Trạng thái phục vụ",
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateMenuItemDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        example: "https://example.com/image.jpg",
        description: "Link ảnh sản phẩm",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "imageUrl", void 0);
//# sourceMappingURL=create-menu-item.dto.js.map