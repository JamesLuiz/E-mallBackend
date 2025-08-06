import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobFilterDto } from './dto/job-filter.dto';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class CareersService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
  ) {}

  // Job methods
  async createJob(createJobDto: CreateJobDto): Promise<Job> {
    const created = new this.jobModel(createJobDto);
    return created.save();
  }

  async findAllJobs(filter: JobFilterDto): Promise<Job[]> {
    const query: any = {};
    if (filter.type) query.type = filter.type;
    if (filter.location) query.location = filter.location;
    if (filter.search) query.$text = { $search: filter.search };
    return this.jobModel.find(query).exec();
  }

  async findJob(id: string): Promise<Job> {
    const job = await this.jobModel.findById(id).exec();
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async updateJob(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    const job = await this.jobModel.findByIdAndUpdate(id, updateJobDto, { new: true }).exec();
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async removeJob(id: string): Promise<void> {
    const result = await this.jobModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Job not found');
  }

  // Application methods
  async createApplication(createApplicationDto: CreateApplicationDto): Promise<Application> {
    const created = new this.applicationModel(createApplicationDto);
    return created.save();
  }

  async findAllApplications(jobId?: string): Promise<Application[]> {
    const query: any = {};
    if (jobId) query.jobId = jobId;
    return this.applicationModel.find(query).exec();
  }

  async findApplication(id: string): Promise<Application> {
    const application = await this.applicationModel.findById(id).exec();
    if (!application) throw new NotFoundException('Application not found');
    return application;
  }

  async removeApplication(id: string): Promise<void> {
    const result = await this.applicationModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Application not found');
  }
}
