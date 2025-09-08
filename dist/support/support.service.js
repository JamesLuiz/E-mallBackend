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
exports.SupportService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ticket_schema_1 = require("./schemas/ticket.schema");
let SupportService = class SupportService {
    constructor(ticketModel) {
        this.ticketModel = ticketModel;
    }
    async create(createTicketDto) {
        const created = new this.ticketModel(createTicketDto);
        return created.save();
    }
    async findAll(filter) {
        return this.ticketModel.find(filter).exec();
    }
    async findOne(id) {
        const ticket = await this.ticketModel.findById(id).exec();
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        return ticket;
    }
    async update(id, updateTicketDto) {
        const ticket = await this.ticketModel.findByIdAndUpdate(id, updateTicketDto, { new: true }).exec();
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        return ticket;
    }
    async remove(id) {
        const result = await this.ticketModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException('Ticket not found');
    }
};
exports.SupportService = SupportService;
exports.SupportService = SupportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(ticket_schema_1.Ticket.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SupportService);
//# sourceMappingURL=support.service.js.map