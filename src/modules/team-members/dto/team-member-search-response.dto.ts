import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TeamMember } from '../entities/team-member.entity';

@ObjectType()
export class TeamMemberSearchResponse {
  @Field(() => [TeamMember], { description: 'List of team members matching the search criteria' })
  teamMembers: TeamMember[];

  @Field(() => Int, { description: 'Total number of team members matching the criteria' })
  total: number;

  @Field(() => Int, { description: 'Current page number' })
  page: number;

  @Field(() => Int, { description: 'Number of items per page' })
  limit: number;

  @Field(() => Int, { description: 'Total number of pages' })
  totalPages: number;
}
