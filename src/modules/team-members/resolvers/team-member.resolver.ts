import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent, Int } from '@nestjs/graphql';
import { TeamMember, TeamMemberStatus, PermissionType } from '../entities/team-member.entity';
import { TeamMemberService } from '../services/team-member.service';
import { CreateTeamMemberInput } from '../dto/create-team-member.input';
import { UpdateTeamMemberInput } from '../dto/update-team-member.input';
import { TeamMemberQueryInput } from '../dto/team-member-filter.input';
import { TeamMemberSearchResponse } from '../dto/team-member-search-response.dto';
import { NotFoundException, Logger, Inject } from '@nestjs/common';

@Resolver(() => TeamMember)
export class TeamMemberResolver {
  constructor(
    private readonly teamMemberService: TeamMemberService,
    @Inject(Logger) private readonly logger: Logger,
  ) {}

  @Query(() => [TeamMember], {
    name: 'getTeamMembers',
    description: 'Get all team members, optionally filtered by club ID',
  })
  async getTeamMembers(
    @Args('clubId', { type: () => ID, nullable: true })
    clubId?: string,
  ): Promise<TeamMember[]> {
    return this.teamMemberService.findAll(clubId);
  }

  @Query(() => TeamMember, {
    name: 'getTeamMember',
    description: 'Get a single team member by ID',
  })
  async getTeamMember(@Args('id', { type: () => ID }) id: string): Promise<TeamMember> {
    const teamMember = await this.teamMemberService.findOne(id);
    if (!teamMember) {
      throw new NotFoundException('Team member not found');
    }
    return teamMember;
  }

  @Query(() => [TeamMember], {
    name: 'getTeamMembersByClub',
    description: 'Get all team members for a specific club',
  })
  async getTeamMembersByClub(
    @Args('clubId', { type: () => ID }) clubId: string,
  ): Promise<TeamMember[]> {
    return this.teamMemberService.findByClubId(clubId);
  }

  @Query(() => [TeamMember], {
    name: 'getTeamMembersByStatus',
    description: 'Get team members filtered by status',
  })
  async getTeamMembersByStatus(
    @Args('status') status: string,
    @Args('clubId', { type: () => ID, nullable: true })
    clubId?: string,
  ): Promise<TeamMember[]> {
    return this.teamMemberService.findByStatus(status, clubId);
  }

  @Query(() => [TeamMember], {
    name: 'getTeamMembersByPosition',
    description: 'Get team members filtered by position',
  })
  async getTeamMembersByPosition(
    @Args('position') position: string,
    @Args('clubId', { type: () => ID, nullable: true })
    clubId?: string,
  ): Promise<TeamMember[]> {
    return this.teamMemberService.findByPosition(position, clubId);
  }

  @Query(() => [TeamMember], {
    name: 'getTeamMembersByPermissions',
    description: 'Get team members filtered by permissions',
  })
  async getTeamMembersByPermissions(
    @Args('permissions', { type: () => [PermissionType] }) permissions: PermissionType[],
    @Args('clubId', { type: () => ID, nullable: true })
    clubId?: string,
  ): Promise<TeamMember[]> {
    return this.teamMemberService.findByPermissions(permissions, clubId);
  }

  @Query(() => TeamMemberSearchResponse, {
    name: 'searchTeamMembers',
    description: 'Advanced search and filtering for team members with pagination',
  })
  async searchTeamMembers(
    @Args('query') query: TeamMemberQueryInput,
  ): Promise<TeamMemberSearchResponse> {
    return this.teamMemberService.findWithAdvancedFilters(query);
  }

  @Query(() => [TeamMember], {
    name: 'searchTeamMembersByName',
    description: 'Search team members by name, surname, or email',
  })
  async searchTeamMembersByName(
    @Args('searchTerm') searchTerm: string,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('clubId', { type: () => ID, nullable: true }) clubId?: string,
  ): Promise<TeamMember[]> {
    return this.teamMemberService.searchByName(searchTerm, limit, clubId);
  }

  @Query(() => Int, {
    name: 'getTeamMemberCount',
    description: 'Get total count of team members with optional filters',
  })
  async getTeamMemberCount(
    @Args('status', { type: () => TeamMemberStatus, nullable: true })
    status?: TeamMemberStatus,
    @Args('clubId', { type: () => ID, nullable: true }) clubId?: string,
  ): Promise<number> {
    return this.teamMemberService.getCount(status, clubId);
  }

  @Mutation(() => TeamMember, {
    name: 'createTeamMember',
    description: 'Create a new team member',
  })
  async createTeamMember(@Args('input') input: CreateTeamMemberInput): Promise<TeamMember> {
    return this.teamMemberService.create(input);
  }

  @Mutation(() => TeamMember, {
    name: 'updateTeamMember',
    description: 'Update an existing team member',
  })
  async updateTeamMember(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateTeamMemberInput,
  ): Promise<TeamMember> {
    return this.teamMemberService.update(id, input);
  }

  @Mutation(() => String, {
    name: 'deleteTeamMember',
    description: 'Delete a team member',
  })
  async deleteTeamMember(@Args('id', { type: () => ID }) id: string): Promise<string> {
    try {
      const result = await this.teamMemberService.remove(id);
      if (!result) {
        throw new NotFoundException('Team member not found');
      } else {
        this.logger.log(`Team member deleted successfully for id ${id}`);
        return 'Team member deleted successfully';
      }
    } catch (error) {
      this.logger.error(`Failed to delete team member ${id}:`, error);
      throw error;
    }
  }

  @Mutation(() => TeamMember, {
    name: 'updateTeamMemberStatus',
    description: 'Update team member status',
  })
  async updateTeamMemberStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => TeamMemberStatus }) status: TeamMemberStatus,
  ): Promise<TeamMember> {
    return this.teamMemberService.updateStatus(id, status);
  }

  @Mutation(() => TeamMember, {
    name: 'updateTeamMemberPermissions',
    description: 'Update team member permissions',
  })
  async updateTeamMemberPermissions(
    @Args('id', { type: () => ID }) id: string,
    @Args('permissions', { type: () => [PermissionType] }) permissions: PermissionType[],
  ): Promise<TeamMember> {
    return this.teamMemberService.updatePermissions(id, permissions);
  }

  @Mutation(() => TeamMember, {
    name: 'addTeamMemberPermission',
    description: 'Add a permission to a team member',
  })
  async addTeamMemberPermission(
    @Args('id', { type: () => ID }) id: string,
    @Args('permission', { type: () => PermissionType }) permission: PermissionType,
  ): Promise<TeamMember> {
    return this.teamMemberService.addPermission(id, permission);
  }

  @Mutation(() => TeamMember, {
    name: 'removeTeamMemberPermission',
    description: 'Remove a permission from a team member',
  })
  async removeTeamMemberPermission(
    @Args('id', { type: () => ID }) id: string,
    @Args('permission', { type: () => PermissionType }) permission: PermissionType,
  ): Promise<TeamMember> {
    return this.teamMemberService.removePermission(id, permission);
  }

  @Mutation(() => [TeamMember], {
    name: 'bulkUpdateTeamMemberStatus',
    description: 'Update status for multiple team members',
  })
  async bulkUpdateTeamMemberStatus(
    @Args('ids', { type: () => [ID] }) ids: string[],
    @Args('status', { type: () => TeamMemberStatus }) status: TeamMemberStatus,
  ): Promise<TeamMember[]> {
    return this.teamMemberService.bulkUpdateStatus(ids, status);
  }

  @Mutation(() => Boolean, {
    name: 'bulkDeleteTeamMembers',
    description: 'Delete multiple team members',
  })
  async bulkDeleteTeamMembers(@Args('ids', { type: () => [ID] }) ids: string[]): Promise<boolean> {
    return this.teamMemberService.bulkDelete(ids);
  }

  @ResolveField(() => String, {
    name: 'fullName',
    description: 'Full name of the team member (name + surname)',
  })
  getFullName(@Parent() teamMember: TeamMember): string {
    return `${teamMember.name} ${teamMember.surname}`.trim();
  }

  @ResolveField(() => String, {
    name: 'fullPhone',
    description: 'Full phone number with country code',
  })
  getFullPhone(@Parent() teamMember: TeamMember): string {
    if (!teamMember.phone) return '';
    const countryCode = teamMember.countryCode || '';
    return `${countryCode}${teamMember.phone}`;
  }

  @ResolveField(() => Boolean, {
    name: 'isActive',
    description: 'Whether the team member is currently active',
  })
  getIsActive(@Parent() teamMember: TeamMember): boolean {
    return teamMember.status === TeamMemberStatus.ACTIVE;
  }

  @ResolveField(() => Int, {
    name: 'permissionCount',
    description: 'Number of permissions assigned to the team member',
  })
  getPermissionCount(@Parent() teamMember: TeamMember): number {
    return teamMember.permissions?.length || 0;
  }
}
