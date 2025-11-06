import { Module } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubSetup } from './entities/club.entity';
import { ClubSetupService } from './club.service';
import { ClubSetupResolver } from './club.resolver';
import { S3UploadService } from '../../common/upload/s3-upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClubSetup])],
  providers: [ClubSetupService, ClubSetupResolver, S3UploadService, Logger],
  exports: [ClubSetupService],
})
export class ClubSetupModule {}
