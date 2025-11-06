import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UserGroup } from '../entities/user-group.entity';
import { UserGroupService } from '../services/user-group.service';
import { CreateUserGroupInput } from '../dto/create-user-group.input';
import { UpdateUserGroupInput } from '../dto/update-user-group.input';
import { NotFoundException, Logger, Inject } from '@nestjs/common';

@Resolver(() => UserGroup)
export class UserGroupResolver {
  @Inject(Logger) private readonly logger: Logger = new Logger(UserGroupResolver.name);
  constructor(private readonly service: UserGroupService) {}

  @Query(() => [UserGroup], { name: 'getUserGroups' })
  async getUserGroups(@Args('clubId', { type: () => ID, nullable: true }) clubId?: string) {
    return this.service.findAll(clubId);
  }

  @Query(() => UserGroup, { name: 'getUserGroup', nullable: true })
  async getUserGroup(@Args('id', { type: () => ID }) id: string) {
    return this.service.findOne(id);
  }

  @Mutation(() => UserGroup, { name: 'createUserGroup' })
  async createUserGroup(@Args('input') input: CreateUserGroupInput) {
    return this.service.create(input);
  }

  @Mutation(() => UserGroup, { name: 'updateUserGroup' })
  async updateUserGroup(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserGroupInput,
  ) {
    return this.service.update(id, input);
  }

  @Mutation(() => String, { name: 'deleteUserGroup' })
  async deleteUserGroup(@Args('id', { type: () => ID }) id: string): Promise<string> {
    try {
      const result = await this.service.remove(id);
      if (!result) {
        throw new NotFoundException('User group not found');
      } else {
        this.logger.log(`User group deleted successfully for id ${id}`);
        return 'User group deleted successfully';
      }
    } catch (error) {
      this.logger.error(`Failed to delete user group ${id}:`, error);
      throw error;
    }
  }
}
