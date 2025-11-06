import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Pricing } from '../entities/pricing.entity';
import { PricingService } from '../services/pricing.service';
import { CreatePricingInput } from '../dto/create-pricing.input';
import { UpdatePricingInput } from '../dto/update-pricing.input';
import { NotFoundException, Logger, Inject } from '@nestjs/common';

@Resolver(() => Pricing)
export class PricingResolver {
  constructor(
    private readonly service: PricingService,
    @Inject(Logger) private readonly logger: Logger,
  ) {}

  @Query(() => [Pricing], { name: 'getPricings' })
  getPricings(@Args('clubId', { type: () => ID, nullable: true }) clubId?: string) {
    return this.service.findAll(clubId);
  }

  @Query(() => Pricing, { name: 'getPricing', nullable: true })
  getPricing(@Args('id', { type: () => ID }) id: string) {
    return this.service.findOne(id);
  }

  @Mutation(() => Pricing, { name: 'createPricing' })
  createPricing(@Args('input') input: CreatePricingInput) {
    return this.service.create(input);
  }

  @Mutation(() => Pricing, { name: 'updatePricing' })
  updatePricing(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdatePricingInput,
  ) {
    return this.service.update(id, input);
  }

  @Mutation(() => String, { name: 'deletePricing' })
  async deletePricing(@Args('id', { type: () => ID }) id: string) {
    try {
      const result = await this.service.remove(id);
      if (!result) {
        throw new NotFoundException('Pricing not found');
      } else {
        this.logger.log(`Pricing deleted successfully for id ${id}`);
        return 'Pricing deleted successfully';
      }
    } catch (error) {
      this.logger.error(`Failed to delete pricing ${id}:`, error);
      throw error;
    }
  }
}
