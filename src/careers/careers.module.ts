import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CareersController } from './careers.controller';
import { CareersService } from './careers.service';
import { Job, JobSchema } from './schemas/job.schema';
import { Application, ApplicationSchema } from './schemas/application.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Job.name, schema: JobSchema },
    { name: Application.name, schema: ApplicationSchema },
  ])],
  controllers: [CareersController],
  providers: [CareersService],
})
export class CareersModule {}
