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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportController = void 0;
const common_1 = require("@nestjs/common");
const support_service_1 = require("./support.service");
const create_ticket_dto_1 = require("./dto/create-ticket.dto");
const update_ticket_dto_1 = require("./dto/update-ticket.dto");
const ticket_filter_dto_1 = require("./dto/ticket-filter.dto");
let SupportController = class SupportController {
    constructor(supportService) {
        this.supportService = supportService;
    }
    async findAll(filter) {
        return this.supportService.findAll(filter);
    }
    async findOne(id) {
        return this.supportService.findOne(id);
    }
    async create(createTicketDto) {
        return this.supportService.create(createTicketDto);
    }
    async update(id, updateTicketDto) {
        return this.supportService.update(id, updateTicketDto);
    }
    async remove(id) {
        await this.supportService.remove(id);
        return { message: 'Ticket deleted' };
    }
};
exports.SupportController = SupportController;
__decorate([
    (0, common_1.Get)('tickets'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ticket_filter_dto_1.TicketFilterDto]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('tickets/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('tickets'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ticket_dto_1.CreateTicketDto]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('tickets/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ticket_dto_1.UpdateTicketDto]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('tickets/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "remove", null);
exports.SupportController = SupportController = __decorate([
    (0, common_1.Controller)('support'),
    __metadata("design:paramtypes", [support_service_1.SupportService])
], SupportController);
//# sourceMappingURL=support.controller.js.map