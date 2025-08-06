import { CareersService } from './careers.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobFilterDto } from './dto/job-filter.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
export declare class CareersController {
    private readonly careersService;
    constructor(careersService: CareersService);
    findAllJobs(filter: JobFilterDto): Promise<import("./schemas/job.schema").Job[]>;
    findJob(id: string): Promise<import("./schemas/job.schema").Job>;
    createJob(createJobDto: CreateJobDto): Promise<import("./schemas/job.schema").Job>;
    updateJob(id: string, updateJobDto: UpdateJobDto): Promise<import("./schemas/job.schema").Job>;
    removeJob(id: string): Promise<{
        message: string;
    }>;
    findAllApplications(jobId?: string): Promise<import("./schemas/application.schema").Application[]>;
    findApplication(id: string): Promise<import("./schemas/application.schema").Application>;
    createApplication(createApplicationDto: CreateApplicationDto): Promise<import("./schemas/application.schema").Application>;
    removeApplication(id: string): Promise<{
        message: string;
    }>;
}
