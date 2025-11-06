import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { ResourceService } from './services/resource.service';
import { ResourceResolver } from './resolvers/resource.resolver';
import { Logger } from '@nestjs/common';
import { ClubSetupModule } from '../club/club.module';

@Module({
  imports: [TypeOrmModule.forFeature([Resource]), ClubSetupModule],
  providers: [ResourceService, ResourceResolver, Logger],
  exports: [ResourceService],
})
export class ResourceModule {}
