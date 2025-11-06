import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMember } from './entities/team-member.entity';
import { TeamMemberService } from './services/team-member.service';
import { TeamMemberResolver } from './resolvers/team-member.resolver';
import { Logger } from '@nestjs/common';
import { ClubSetupModule } from '../club/club.module';

@Module({
  imports: [TypeOrmModule.forFeature([TeamMember]), ClubSetupModule],
  providers: [TeamMemberService, TeamMemberResolver, Logger],
  exports: [TeamMemberService],
})
export class TeamMembersModule {}
