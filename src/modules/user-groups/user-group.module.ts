import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroup } from './entities/user-group.entity';
import { UserGroupService } from './services/user-group.service';
import { UserGroupResolver } from './resolvers/user-group.resolver';
import { Logger } from '@nestjs/common';
import { ClubSetupModule } from '../club/club.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserGroup]), ClubSetupModule],
  providers: [UserGroupService, UserGroupResolver, Logger],
  exports: [UserGroupService],
})
export class UserGroupModule {}
