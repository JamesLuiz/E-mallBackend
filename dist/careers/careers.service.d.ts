import { Model } from 'mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobFilterDto } from './dto/job-filter.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
export declare class CareersService {
    private jobModel;
    private applicationModel;
    constructor(jobModel: Model<JobDocument>, applicationModel: Model<ApplicationDocument>);
    createJob(createJobDto: CreateJobDto): Promise<Job>;
    findAllJobs(filter: JobFilterDto): Promise<Job[]>;
    findJob(id: string): Promise<Job>;
    updateJob(id: string, updateJobDto: UpdateJobDto): Promise<Job>;
    removeJob(id: string): Promise<void>;
    createApplication(createApplicationDto: CreateApplicationDto): Promise<Application>;
    findAllApplications(jobId?: string): Promise<Application[]>;
    findApplication(id: string): Promise<Application>;
    removeApplication(id: string): Promise<void>;
}
