import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { PromoCode } from '../entities/promocode.entity';
import { PromoCodeService } from '../services/promocode.service';
import { CreatePromoCodeInput } from '../dto/create-promocode.input';
import { UpdatePromoCodeInput } from '../dto/update-promocode.input';
import { NotFoundException, Logger, Inject } from '@nestjs/common';

@Resolver(() => PromoCode)
export class PromoCodeResolver {
  constructor(
    private readonly service: PromoCodeService,
    @Inject(Logger) private readonly logger: Logger,
  ) {}

  @Query(() => [PromoCode], { name: 'getPromoCodes' })
  getPromoCodes(@Args('clubId', { type: () => ID, nullable: true }) clubId?: string) {
    return this.service.findAll(clubId);
  }

  @Query(() => PromoCode, { name: 'getPromoCode', nullable: true })
  getPromoCode(@Args('id', { type: () => ID }) id: string) {
    return this.service.findOne(id);
  }

  @Mutation(() => PromoCode, { name: 'createPromoCode' })
  createPromoCode(@Args('input') input: CreatePromoCodeInput) {
    return this.service.create(input);
  }

  @Mutation(() => PromoCode, { name: 'updatePromoCode' })
  updatePromoCode(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdatePromoCodeInput,
  ) {
    return this.service.update(id, input);
  }

  @Mutation(() => String, { name: 'deletePromoCode' })
  async deletePromoCode(@Args('id', { type: () => ID }) id: string): Promise<string> {
    try {
      const result = await this.service.remove(id);
      if (!result) {
        throw new NotFoundException('Promo code not found');
      } else {
        this.logger.log(`Promo code deleted successfully for id ${id}`);
        return 'Promo code deleted successfully';
      }
    } catch (error) {
      this.logger.error(`Failed to delete promo code ${id}:`, error);
      throw error;
    }
  }
}
