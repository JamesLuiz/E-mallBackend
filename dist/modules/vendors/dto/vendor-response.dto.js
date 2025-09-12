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
exports.VendorResponseDto = void 0;
const class_transformer_1 = require("class-transformer");
class VendorResponseDto {
}
exports.VendorResponseDto = VendorResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], VendorResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], VendorResponseDto.prototype, "businessName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], VendorResponseDto.prototype, "businessDescription", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], VendorResponseDto.prototype, "businessAddress", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], VendorResponseDto.prototype, "storeSettings", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], VendorResponseDto.prototype, "verified", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], VendorResponseDto.prototype, "rating", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], VendorResponseDto.prototype, "totalSales", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ obj }) => obj.userId?.email),
    __metadata("design:type", String)
], VendorResponseDto.prototype, "userEmail", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ obj }) => obj.userId?.profile),
    __metadata("design:type", Object)
], VendorResponseDto.prototype, "userProfile", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], VendorResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], VendorResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], VendorResponseDto.prototype, "kycDocuments", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], VendorResponseDto.prototype, "userId", void 0);
//# sourceMappingURL=vendor-response.dto.js.map