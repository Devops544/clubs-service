import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Membership } from '../entities/membership.entity';
import { MembershipService } from '../services/membership.service';
import { CreateMembershipInput } from '../dto/create-membership.input';
import { UpdateMembershipInput } from '../dto/update-membership.input';
import { NotFoundException, Logger, Inject } from '@nestjs/common';

@Resolver(() => Membership)
export class MembershipResolver {
  constructor(
    private readonly service: MembershipService,
    @Inject(Logger) private readonly logger: Logger,
  ) {}

  @Query(() => [Membership], { name: 'getMemberships' })
  getMemberships(@Args('clubId', { type: () => ID, nullable: true }) clubId?: string) {
    return this.service.findAll(clubId);
  }

  @Query(() => Membership, { name: 'getMembership', nullable: true })
  getMembership(@Args('id', { type: () => ID }) id: string) {
    return this.service.findOne(id);
  }

  @Mutation(() => Membership, { name: 'createMembership' })
  createMembership(@Args('input') input: CreateMembershipInput) {
    return this.service.create(input);
  }

  @Mutation(() => Membership, { name: 'updateMembership' })
  updateMembership(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateMembershipInput,
  ) {
    return this.service.update(id, input);
  }

  @Mutation(() => String, { name: 'deleteMembership' })
  async deleteMembership(@Args('id', { type: () => ID }) id: string) {
    try {
      const result = await this.service.remove(id);
      if (!result) {
        throw new NotFoundException('Membership not found');
      } else {
        this.logger.log(`Membership deleted successfully for id ${id}`);
        return 'Membership deleted successfully';
      }
    } catch (error) {
      this.logger.error(`Failed to delete membership ${id}:`, error);
      throw error;
    }
  }
}
