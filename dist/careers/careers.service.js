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
exports.CareersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const job_schema_1 = require("./schemas/job.schema");
const application_schema_1 = require("./schemas/application.schema");
let CareersService = class CareersService {
    constructor(jobModel, applicationModel) {
        this.jobModel = jobModel;
        this.applicationModel = applicationModel;
    }
    async createJob(createJobDto) {
        const created = new this.jobModel(createJobDto);
        return created.save();
    }
    async findAllJobs(filter) {
        const query = {};
        if (filter.type)
            query.type = filter.type;
        if (filter.location)
            query.location = filter.location;
        if (filter.search)
            query.$text = { $search: filter.search };
        return this.jobModel.find(query).exec();
    }
    async findJob(id) {
        const job = await this.jobModel.findById(id).exec();
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        return job;
    }
    async updateJob(id, updateJobDto) {
        const job = await this.jobModel.findByIdAndUpdate(id, updateJobDto, { new: true }).exec();
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        return job;
    }
    async removeJob(id) {
        const result = await this.jobModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException('Job not found');
    }
    async createApplication(createApplicationDto) {
        const created = new this.applicationModel(createApplicationDto);
        return created.save();
    }
    async findAllApplications(jobId) {
        const query = {};
        if (jobId)
            query.jobId = jobId;
        return this.applicationModel.find(query).exec();
    }
    async findApplication(id) {
        const application = await this.applicationModel.findById(id).exec();
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        return application;
    }
    async removeApplication(id) {
        const result = await this.applicationModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException('Application not found');
    }
};
exports.CareersService = CareersService;
exports.CareersService = CareersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(job_schema_1.Job.name)),
    __param(1, (0, mongoose_1.InjectModel)(application_schema_1.Application.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CareersService);
//# sourceMappingURL=careers.service.js.map