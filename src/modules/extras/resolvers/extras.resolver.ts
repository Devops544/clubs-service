import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent, Int } from '@nestjs/graphql';
import { Extras, ExtrasStatus } from '../entities/extras.entity';
import { ExtrasService } from '../services/extras.service';
import { CreateExtrasInput } from '../dto/create-extras.input';
import { UpdateExtrasInput } from '../dto/update-extras.input';
import { ExtrasQueryInput } from '../dto/extras-filter.input';
import { ExtrasSearchResponse } from '../dto/extras-search-response.dto';
import { IntegrationStats } from '../dto/integration-stats.dto';
import { NotFoundException, Logger, Inject } from '@nestjs/common';

@Resolver(() => Extras)
export class ExtrasResolver {
  constructor(
    private readonly extrasService: ExtrasService,
    @Inject(Logger) private readonly logger: Logger,
  ) {}

  @Query(() => [Extras], {
    name: 'getExtras',
    description: 'Get all extras configurations, optionally filtered by club ID',
  })
  async getExtras(
    @Args('clubId', { type: () => ID, nullable: true })
    clubId?: string,
  ): Promise<Extras[]> {
    return this.extrasService.findAll(clubId);
  }

  @Query(() => Extras, {
    name: 'getExtrasById',
    description: 'Get a single extras configuration by ID',
  })
  async getExtrasById(@Args('id', { type: () => ID }) id: string): Promise<Extras> {
    const extras = await this.extrasService.findOne(id);
    if (!extras) {
      throw new NotFoundException('Extras configuration not found');
    }
    return extras;
  }

  @Query(() => [Extras], {
    name: 'getExtrasByClub',
    description: 'Get all extras configurations for a specific club',
  })
  async getExtrasByClub(@Args('clubId', { type: () => ID }) clubId: string): Promise<Extras[]> {
    return this.extrasService.findByClubId(clubId);
  }

  @Query(() => [Extras], {
    name: 'getExtrasByStatus',
    description: 'Get extras configurations filtered by status',
  })
  async getExtrasByStatus(
    @Args('status') status: string,
    @Args('clubId', { type: () => ID, nullable: true })
    clubId?: string,
  ): Promise<Extras[]> {
    return this.extrasService.findByStatus(status, clubId);
  }

  @Query(() => [Extras], {
    name: 'getExtrasByFeature',
    description: 'Get extras configurations filtered by feature and enabled status',
  })
  async getExtrasByFeature(
    @Args('feature') feature: string,
    @Args('enabled') enabled: boolean,
    @Args('clubId', { type: () => ID, nullable: true })
    clubId?: string,
  ): Promise<Extras[]> {
    return this.extrasService.findByFeature(feature, enabled, clubId);
  }

  @Query(() => ExtrasSearchResponse, {
    name: 'searchExtras',
    description: 'Advanced search and filtering for extras configurations with pagination',
  })
  async searchExtras(@Args('query') query: ExtrasQueryInput): Promise<ExtrasSearchResponse> {
    return this.extrasService.findWithAdvancedFilters(query);
  }

  @Query(() => [Extras], {
    name: 'searchExtrasByDescription',
    description: 'Search extras configurations by description and notes',
  })
  async searchExtrasByDescription(
    @Args('searchTerm') searchTerm: string,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('clubId', { type: () => ID, nullable: true }) clubId?: string,
  ): Promise<Extras[]> {
    return this.extrasService.searchByDescription(searchTerm, limit, clubId);
  }

  @Query(() => Int, {
    name: 'getExtrasCount',
    description: 'Get total count of extras configurations with optional filters',
  })
  async getExtrasCount(
    @Args('status', { type: () => ExtrasStatus, nullable: true })
    status?: ExtrasStatus,
    @Args('clubId', { type: () => ID, nullable: true }) clubId?: string,
  ): Promise<number> {
    return this.extrasService.getCount(status, clubId);
  }

  @Query(() => IntegrationStats, {
    name: 'getIntegrationStats',
    description: 'Get integration statistics for extras configurations',
  })
  async getIntegrationStats(
    @Args('clubId', { type: () => ID, nullable: true }) clubId?: string,
  ): Promise<IntegrationStats> {
    return this.extrasService.getIntegrationStats(clubId);
  }

  @Mutation(() => Extras, {
    name: 'createExtras',
    description: 'Create a new extras configuration',
  })
  async createExtras(@Args('input') input: CreateExtrasInput): Promise<Extras> {
    return this.extrasService.create(input);
  }

  @Mutation(() => Extras, {
    name: 'updateExtras',
    description: 'Update an existing extras configuration',
  })
  async updateExtras(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateExtrasInput,
  ): Promise<Extras> {
    return this.extrasService.update(id, input);
  }

  @Mutation(() => String, {
    name: 'deleteExtras',
    description: 'Delete an extras configuration',
  })
  async deleteExtras(@Args('id', { type: () => ID }) id: string): Promise<string> {
    try {
      const result = await this.extrasService.remove(id);
      if (!result) {
        throw new NotFoundException('Extras configuration not found');
      } else {
        this.logger.log(`Extras configuration deleted successfully for id ${id}`);
        return 'Extras configuration deleted successfully';
      }
    } catch (error) {
      this.logger.error(`Failed to delete extras configuration ${id}:`, error);
      throw error;
    }
  }

  @Mutation(() => Extras, {
    name: 'updateExtrasStatus',
    description: 'Update extras configuration status',
  })
  async updateExtrasStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => ExtrasStatus }) status: ExtrasStatus,
  ): Promise<Extras> {
    return this.extrasService.updateStatus(id, status);
  }

  @Mutation(() => Extras, {
    name: 'toggleExtrasFeature',
    description: 'Toggle a specific feature on/off for an extras configuration',
  })
  async toggleExtrasFeature(
    @Args('id', { type: () => ID }) id: string,
    @Args('feature') feature: string,
    @Args('enabled') enabled: boolean,
  ): Promise<Extras> {
    return this.extrasService.toggleFeature(id, feature, enabled);
  }

  @Mutation(() => [Extras], {
    name: 'bulkUpdateExtrasStatus',
    description: 'Update status for multiple extras configurations',
  })
  async bulkUpdateExtrasStatus(
    @Args('ids', { type: () => [ID] }) ids: string[],
    @Args('status', { type: () => ExtrasStatus }) status: ExtrasStatus,
  ): Promise<Extras[]> {
    return this.extrasService.bulkUpdateStatus(ids, status);
  }

  @Mutation(() => Boolean, {
    name: 'bulkDeleteExtras',
    description: 'Delete multiple extras configurations',
  })
  async bulkDeleteExtras(@Args('ids', { type: () => [ID] }) ids: string[]): Promise<boolean> {
    return this.extrasService.bulkDelete(ids);
  }

  @ResolveField(() => Boolean, {
    name: 'isActive',
    description: 'Whether the extras configuration is currently active',
  })
  getIsActive(@Parent() extras: Extras): boolean {
    return extras.status === ExtrasStatus.ACTIVE;
  }

  @ResolveField(() => Int, {
    name: 'hourBankLimitCount',
    description: 'Number of hour bank limits configured',
  })
  getHourBankLimitCount(@Parent() extras: Extras): number {
    return extras.hourBankLimits?.length || 0;
  }

  @ResolveField(() => Int, {
    name: 'wishlistLimitCount',
    description: 'Number of wishlist limits configured',
  })
  getWishlistLimitCount(@Parent() extras: Extras): number {
    return extras.wishlistLimits?.length || 0;
  }

  @ResolveField(() => Int, {
    name: 'integrationCount',
    description: 'Number of integrations configured',
  })
  getIntegrationCount(@Parent() extras: Extras): number {
    let count = 0;
    if (extras.externalBookingSystem) count++;
    if (extras.paymentGateway) count++;
    if (extras.emailMarketing) count++;
    if (extras.analyticsIntegration) count++;
    if (extras.socialMediaIntegration) count++;
    return count;
  }

  @ResolveField(() => [String], {
    name: 'enabledFeatures',
    description: 'List of enabled features',
  })
  getEnabledFeatures(@Parent() extras: Extras): string[] {
    const features: string[] = [];
    if (extras.hourBank) features.push('hourBank');
    if (extras.wishlist) features.push('wishlist');
    return features;
  }

  @ResolveField(() => [String], {
    name: 'activeIntegrations',
    description: 'List of active integrations',
  })
  getActiveIntegrations(@Parent() extras: Extras): string[] {
    const integrations: string[] = [];
    if (extras.externalBookingSystem) integrations.push('externalBooking');
    if (extras.paymentGateway) integrations.push('paymentGateway');
    if (extras.emailMarketing) integrations.push('emailMarketing');
    if (extras.analyticsIntegration) integrations.push('analytics');
    if (extras.socialMediaIntegration) integrations.push('socialMedia');
    return integrations;
  }
}
