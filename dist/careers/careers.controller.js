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
exports.CareersController = void 0;
const common_1 = require("@nestjs/common");
const careers_service_1 = require("./careers.service");
const create_job_dto_1 = require("./dto/create-job.dto");
const update_job_dto_1 = require("./dto/update-job.dto");
const job_filter_dto_1 = require("./dto/job-filter.dto");
const create_application_dto_1 = require("./dto/create-application.dto");
let CareersController = class CareersController {
    constructor(careersService) {
        this.careersService = careersService;
    }
    async findAllJobs(filter) {
        return this.careersService.findAllJobs(filter);
    }
    async findJob(id) {
        return this.careersService.findJob(id);
    }
    async createJob(createJobDto) {
        return this.careersService.createJob(createJobDto);
    }
    async updateJob(id, updateJobDto) {
        return this.careersService.updateJob(id, updateJobDto);
    }
    async removeJob(id) {
        await this.careersService.removeJob(id);
        return { message: 'Job deleted' };
    }
    async findAllApplications(jobId) {
        return this.careersService.findAllApplications(jobId);
    }
    async findApplication(id) {
        return this.careersService.findApplication(id);
    }
    async createApplication(createApplicationDto) {
        return this.careersService.createApplication(createApplicationDto);
    }
    async removeApplication(id) {
        await this.careersService.removeApplication(id);
        return { message: 'Application deleted' };
    }
};
exports.CareersController = CareersController;
__decorate([
    (0, common_1.Get)('jobs'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_filter_dto_1.JobFilterDto]),
    __metadata("design:returntype", Promise)
], CareersController.prototype, "findAllJobs", null);
__decorate([
    (0, common_1.Get)('jobs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CareersController.prototype, "findJob", null);
__decorate([
    (0, common_1.Post)('jobs'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_job_dto_1.CreateJobDto]),
    __metadata("design:returntype", Promise)
], CareersController.prototype, "createJob", null);
__decorate([
    (0, common_1.Put)('jobs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_job_dto_1.UpdateJobDto]),
    __metadata("design:returntype", Promise)
], CareersController.prototype, "updateJob", null);
__decorate([
    (0, common_1.Delete)('jobs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CareersController.prototype, "removeJob", null);
__decorate([
    (0, common_1.Get)('applications'),
    __param(0, (0, common_1.Query)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CareersController.prototype, "findAllApplications", null);
__decorate([
    (0, common_1.Get)('applications/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CareersController.prototype, "findApplication", null);
__decorate([
    (0, common_1.Post)('applications'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_application_dto_1.CreateApplicationDto]),
    __metadata("design:returntype", Promise)
], CareersController.prototype, "createApplication", null);
__decorate([
    (0, common_1.Delete)('applications/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CareersController.prototype, "removeApplication", null);
exports.CareersController = CareersController = __decorate([
    (0, common_1.Controller)('careers'),
    __metadata("design:paramtypes", [careers_service_1.CareersService])
], CareersController);
//# sourceMappingURL=careers.controller.js.map