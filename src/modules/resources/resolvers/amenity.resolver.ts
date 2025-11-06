import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Logger, Inject, NotFoundException } from '@nestjs/common';
import { AmenityService } from '../services/amenity.service';
import { Amenity } from '../entities/amenity.entity';
import { CreateAmenityInput } from '../dto/create-amenity.input';
import { UpdateAmenityInput } from '../dto/update-amenity.input';

@Resolver(() => Amenity)
export class AmenityResolver {
  constructor(
    private readonly amenityService: AmenityService,
    @Inject(Logger) private readonly logger: Logger,
  ) {}

  @Mutation(() => Amenity)
  async createAmenity(@Args('input') input: CreateAmenityInput): Promise<Amenity> {
    try {
      const amenity = await this.amenityService.create(input);
      if (!amenity) {
        throw new Error('Failed to create amenity');
      } else {
        this.logger.log('Created amenity:', JSON.stringify(amenity));
        return amenity;
      }
    } catch (error) {
      this.logger.error('Failed to create amenity:', error);
      throw error;
    }
  }

  @Query(() => [Amenity])
  async getAmenities(): Promise<Amenity[]> {
    try {
      return this.amenityService.findAll();
    } catch (error) {
      this.logger.error('Failed to fetch amenities:', error);
      throw error;
    }
  }

  @Query(() => Amenity, { nullable: true })
  async getAmenityByClubId(
    @Args('clubId', { type: () => String }) clubId: string,
  ): Promise<Amenity | null> {
    try {
      return this.amenityService.findByClubId(clubId);
    } catch (error) {
      this.logger.error(`Failed to fetch amenity for club ${clubId}:`, error);
      throw error;
    }
  }

  @Query(() => Amenity, { nullable: true })
  async getAmenity(@Args('id', { type: () => String }) id: string): Promise<Amenity | null> {
    try {
      return this.amenityService.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to find amenity with id ${id}:`, error);
      throw error;
    }
  }

  @Mutation(() => Amenity)
  async updateAmenity(
    @Args('id', { type: () => String }) id: string,
    @Args('input') input: UpdateAmenityInput,
  ): Promise<Amenity> {
    try {
      return this.amenityService.update(id, input);
    } catch (error) {
      this.logger.error(`Failed to update amenity ${id}:`, error);
      throw error;
    }
  }

  @Mutation(() => Amenity)
  async updateAmenityByClubId(
    @Args('clubId', { type: () => String }) clubId: string,
    @Args('input') input: UpdateAmenityInput,
  ): Promise<Amenity> {
    try {
      return this.amenityService.updateByClubId(clubId, input);
    } catch (error) {
      this.logger.error(`Failed to update amenity for club ${clubId}:`, error);
      throw error;
    }
  }

  @Mutation(() => String)
  async deleteAmenity(@Args('id', { type: () => String }) id: string): Promise<string> {
    try {
      const result = await this.amenityService.remove(id);
      if (!result) {
        throw new NotFoundException('Amenity not found');
      } else {
        this.logger.log(`Amenity deleted successfully for id ${id}`);
        return 'Amenity deleted successfully';
      }
    } catch (error) {
      this.logger.error(`Failed to delete amenity ${id}:`, error);
      throw error;
    }
  }

  @Mutation(() => String)
  async deleteAmenityByClubId(
    @Args('clubId', { type: () => String }) clubId: string,
  ): Promise<string> {
    try {
      const result = await this.amenityService.removeByClubId(clubId);
      if (!result) {
        throw new NotFoundException('Amenity not found');
      } else {
        this.logger.log(`Amenity deleted successfully for club ${clubId}`);
        return 'Amenity deleted successfully';
      }
    } catch (error) {
      this.logger.error(`Failed to delete amenity for club ${clubId}:`, error);
      throw error;
    }
  }
}
