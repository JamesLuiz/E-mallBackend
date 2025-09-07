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
exports.VendorSchema = exports.Vendor = exports.Subscription = exports.VendorKycDocuments = exports.StoreSettings = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let StoreSettings = class StoreSettings {
};
exports.StoreSettings = StoreSettings;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StoreSettings.prototype, "logo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StoreSettings.prototype, "logoUri", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StoreSettings.prototype, "logoHash", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StoreSettings.prototype, "banner", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StoreSettings.prototype, "bannerUri", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StoreSettings.prototype, "bannerHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '#40F99B' }),
    __metadata("design:type", String)
], StoreSettings.prototype, "primaryColor", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StoreSettings.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], StoreSettings.prototype, "socialLinks", void 0);
exports.StoreSettings = StoreSettings = __decorate([
    (0, mongoose_1.Schema)()
], StoreSettings);
let VendorKycDocuments = class VendorKycDocuments {
};
exports.VendorKycDocuments = VendorKycDocuments;
__decorate([
    (0, mongoose_1.Prop)({ enum: ['passport', 'national_id', 'drivers_license'] }),
    __metadata("design:type", String)
], VendorKycDocuments.prototype, "identityDocumentType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VendorKycDocuments.prototype, "identityDocumentUri", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VendorKycDocuments.prototype, "identityDocumentHash", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VendorKycDocuments.prototype, "businessCertificateUri", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VendorKycDocuments.prototype, "businessCertificateHash", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VendorKycDocuments.prototype, "taxCertificateUri", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VendorKycDocuments.prototype, "taxCertificateHash", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VendorKycDocuments.prototype, "bankStatementUri", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VendorKycDocuments.prototype, "bankStatementHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'pending' }),
    __metadata("design:type", String)
], VendorKycDocuments.prototype, "verificationStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VendorKycDocuments.prototype, "verificationNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], VendorKycDocuments.prototype, "submittedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], VendorKycDocuments.prototype, "verifiedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VendorKycDocuments.prototype, "verifiedBy", void 0);
exports.VendorKycDocuments = VendorKycDocuments = __decorate([
    (0, mongoose_1.Schema)()
], VendorKycDocuments);
let Subscription = class Subscription {
};
exports.Subscription = Subscription;
__decorate([
    (0, mongoose_1.Prop)({ default: 'basic' }),
    __metadata("design:type", String)
], Subscription.prototype, "plan", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'active' }),
    __metadata("design:type", String)
], Subscription.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Subscription.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Subscription.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 10000 }),
    __metadata("design:type", Number)
], Subscription.prototype, "amount", void 0);
exports.Subscription = Subscription = __decorate([
    (0, mongoose_1.Schema)()
], Subscription);
let Vendor = class Vendor {
};
exports.Vendor = Vendor;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Vendor.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Vendor.prototype, "businessName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Vendor.prototype, "businessDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Vendor.prototype, "businessAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: StoreSettings }),
    __metadata("design:type", StoreSettings)
], Vendor.prototype, "storeSettings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: VendorKycDocuments }),
    __metadata("design:type", VendorKycDocuments)
], Vendor.prototype, "kycDocuments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Subscription }),
    __metadata("design:type", Subscription)
], Vendor.prototype, "subscription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Vendor.prototype, "verified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Vendor.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Vendor.prototype, "totalSales", void 0);
exports.Vendor = Vendor = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Vendor);
exports.VendorSchema = mongoose_1.SchemaFactory.createForClass(Vendor);
//# sourceMappingURL=vendor.schema.js.map