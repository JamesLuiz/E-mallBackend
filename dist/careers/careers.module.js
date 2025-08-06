"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const careers_controller_1 = require("./careers.controller");
const careers_service_1 = require("./careers.service");
const job_schema_1 = require("./schemas/job.schema");
const application_schema_1 = require("./schemas/application.schema");
let CareersModule = class CareersModule {
};
exports.CareersModule = CareersModule;
exports.CareersModule = CareersModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: job_schema_1.Job.name, schema: job_schema_1.JobSchema },
                { name: application_schema_1.Application.name, schema: application_schema_1.ApplicationSchema },
            ])],
        controllers: [careers_controller_1.CareersController],
        providers: [careers_service_1.CareersService],
    })
], CareersModule);
//# sourceMappingURL=careers.module.js.map