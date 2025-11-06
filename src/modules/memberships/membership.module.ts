import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { MembershipService } from './services/membership.service';
import { MembershipResolver } from './resolvers/membership.resolver';
import { Logger } from '@nestjs/common';
import { ClubSetupModule } from '../club/club.module';

@Module({
  imports: [TypeOrmModule.forFeature([Membership]), ClubSetupModule],
  providers: [MembershipService, MembershipResolver, Logger],
  exports: [MembershipService],
})
export class MembershipModule {}
