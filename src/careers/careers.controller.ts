import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { CareersService } from './careers.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobFilterDto } from './dto/job-filter.dto';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('careers')
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  // Job endpoints
  @Get('jobs')
  async findAllJobs(@Query() filter: JobFilterDto) {
    return this.careersService.findAllJobs(filter);
  }

  @Get('jobs/:id')
  async findJob(@Param('id') id: string) {
    return this.careersService.findJob(id);
  }

  @Post('jobs')
  async createJob(@Body() createJobDto: CreateJobDto) {
    return this.careersService.createJob(createJobDto);
  }

  @Put('jobs/:id')
  async updateJob(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.careersService.updateJob(id, updateJobDto);
  }

  @Delete('jobs/:id')
  async removeJob(@Param('id') id: string) {
    await this.careersService.removeJob(id);
    return { message: 'Job deleted' };
  }

  // Application endpoints
  @Get('applications')
  async findAllApplications(@Query('jobId') jobId?: string) {
    return this.careersService.findAllApplications(jobId);
  }

  @Get('applications/:id')
  async findApplication(@Param('id') id: string) {
    return this.careersService.findApplication(id);
  }

  @Post('applications')
  async createApplication(@Body() createApplicationDto: CreateApplicationDto) {
    return this.careersService.createApplication(createApplicationDto);
  }

  @Delete('applications/:id')
  async removeApplication(@Param('id') id: string) {
    await this.careersService.removeApplication(id);
    return { message: 'Application deleted' };
  }
}
