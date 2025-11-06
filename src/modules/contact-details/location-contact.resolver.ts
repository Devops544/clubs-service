import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LocationContactService } from './location-contact.service';
import { LocationContact } from './entities/location-contact.entity';
import { UpdateLocationContactInput } from './dto/update-location-contact.input';
import { CreateLocationContactInput } from './dto/create-location-contact.input';
import { NotFoundException, Logger, Inject } from '@nestjs/common';

@Resolver(() => LocationContact)
export class LocationContactResolver {
  @Inject(Logger) private readonly logger: Logger = new Logger(LocationContactResolver.name);
  constructor(private readonly locationContactService: LocationContactService) {}
  @Query(() => LocationContact, { nullable: true })
  async getLocationContact(
    @Args('clubId', { type: () => String }) clubId: string,
  ): Promise<LocationContact | null> {
    return this.locationContactService.findClubById(clubId);
  }

  @Mutation(() => LocationContact)
  async createLocationContact(
    @Args('input') input: CreateLocationContactInput,
  ): Promise<LocationContact> {
    return this.locationContactService.create(input);
  }

  @Mutation(() => LocationContact)
  async updateLocationContact(
    @Args('clubId', { type: () => String }) clubId: string,
    @Args('input') input: UpdateLocationContactInput,
  ): Promise<LocationContact> {
    return this.locationContactService.update(clubId, input);
  }

  @Mutation(() => String)
  async deleteLocationContact(
    @Args('clubId', { type: () => String }) clubId: string,
  ): Promise<string> {
    try {
      const result = await this.locationContactService.delete(clubId);
      if (!result) {
        throw new NotFoundException('Location contact not found');
      } else {
        this.logger.log(`Location contact deleted successfully for id ${clubId}`);
        return 'Location contact deleted successfully';
      }
    } catch (error) {
      this.logger.error(`Failed to delete location contact ${clubId}:`, error);
      throw error;
    }
  }
}
