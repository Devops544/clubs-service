import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Logger, NotFoundException, UseGuards, Inject } from '@nestjs/common';
import { ClubSetupService } from './club.service';
import { ClubSetup } from './entities/club.entity';
import { CreateClubSetupInput, UpdateClubSetupInput } from './dto/create-club-setup.input';
import { ClubFieldQueryInput, ClubFilter, ClubJsonFieldQueryInput } from './dto/club-query.input';
import { ClubMultiFieldQueryInput } from './dto/club-multi-field-query.input';
import { ClubCreateInput, ClubUpdateInput } from './types/club.types';
import { SetupStatus } from './entities/club.entity';
import { CompleteClubSetupInput } from './dto/complete-club-setup.input';

@Resolver(() => ClubSetup)
export class ClubSetupResolver {
  constructor(
    private readonly clubService: ClubSetupService,
    @Inject(Logger) private readonly logger: Logger,
  ) {}

  @Query(() => ClubSetup, { nullable: true })
  async getClub(@Args('id', { type: () => String }) id: string): Promise<ClubSetup | null> {
    try {
      const club = await this.clubService.findClubById(id);
      if (!club) {
        throw new NotFoundException('club not found');
      }
      return club;
    } catch (error) {
      this.logger.error(`Failed to find club for id ${id}:`, error);
      throw error;
    }
  }

  //Generic query using the helper method
  @Query(() => [ClubSetup], { nullable: true })
  async getAllClubs(
    @Args('filter', { type: () => ClubFilter, nullable: true }) filter?: ClubFilter,
  ): Promise<ClubSetup[]> {
    try {
      const club = await this.clubService.findAll(filter || {});
      return club;
    } catch (error) {
      this.logger.error(`error feting clubs ${error}`);
      throw error;
    }
  }

  @Query(() => ClubSetup, { nullable: true })
  async getClubLocation(@Args('id', { type: () => String }) id: string): Promise<ClubSetup | null> {
    try {
      const club = await this.clubService.getValuesByFieldValueAndRelations('id', id, [
        'locationContact',
        'workingHoursCalendar',
      ]);
      return club;
    } catch (error) {
      this.logger.error(`Failed to find club location for id ${id}:`, error);
      throw error;
    }
  }

  @Query(() => ClubSetup, { nullable: true })
  async getClubResources(
    @Args('id', { type: () => String }) id: string,
  ): Promise<ClubSetup | null> {
    try {
      const club = await this.clubService.getValuesByFieldValueAndRelations('id', id, [
        'resources',
        'amenity',
      ]);
      return club;
    } catch (error) {
      this.logger.error(`Failed to find club resources for id ${id}:`, error);
      throw error;
    }
  }

  //Simplified queries for multiple field filtering
  @Query(() => [ClubSetup])
  async searchClubs(@Args('input') input: ClubMultiFieldQueryInput): Promise<ClubSetup[]> {
    try {
      const clubs = await this.clubService.findClubsWithSecureQuery(
        input.filters,
        input.relations || [],
      );
      if (!clubs || clubs.length === 0) {
        throw new NotFoundException('No clubs found');
      } else {
        return clubs;
      }
    } catch (error) {
      this.logger.error(`Failed to search clubs:`, error);
      throw error;
    }
  }

  @Mutation(() => ClubSetup)
  async createClubSetup(@Args('input') input: CreateClubSetupInput): Promise<ClubSetup> {
    return this.clubService.create(input as unknown as ClubCreateInput);
  }

  @Mutation(() => ClubSetup)
  async updateClubSetup(
    @Args('id', { type: () => String }) id: string,
    @Args('input') input: UpdateClubSetupInput,
  ): Promise<ClubSetup> {
    try {
      const result = await this.clubService.update(id, input as unknown as ClubUpdateInput);
      if (!result) {
        throw new NotFoundException('Club not found');
      } else {
        this.logger.log(`Club updated successfully for id ${id}`);
        return result;
      }
    } catch (error) {
      this.logger.error(`Failed to update club for id ${id}:`, error);
      throw error;
    }
  }

  @Mutation(() => String) // Change return type to String
  async deleteClub(@Args('id', { type: () => String }) id: string): Promise<string> {
    try {
      const result = await this.clubService.delete(id);
      if (!result) {
        throw new NotFoundException('Club not found');
      } else {
        this.logger.log(`Club deleted successfully for id ${id}`);
        return 'Club deleted successfully';
      }
    } catch (error) {
      this.logger.error(`Failed to delete club for id ${id}:`, error);
      throw error;
    }
  }

  @Mutation(() => ClubSetup)
  async completeClubSetup(@Args('input') input: CompleteClubSetupInput): Promise<ClubSetup> {
    try {
      const result = await this.clubService.completeClubSetup(input);
      this.logger.log(`Completed club setup for club ${input.clubId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to complete club setup for club ${input.clubId}:`, error);
      throw error;
    }
  }

  @Query(() => [ClubSetup])
  async getClubsBySetupStatus(
    @Args('status', { type: () => String }) status: SetupStatus,
  ): Promise<ClubSetup[]> {
    try {
      const clubs = await this.clubService.getClubsBySetupStatus(status);
      return clubs;
    } catch (error) {
      this.logger.error(`Failed to get clubs by setup status ${status}:`, error);
      throw error;
    }
  }

  @Mutation(() => ClubSetup)
  async abandonClubSetup(
    @Args('clubId', { type: () => String }) clubId: string,
  ): Promise<ClubSetup> {
    try {
      const result = await this.clubService.abandonClubSetup(clubId);
      this.logger.log(`Abandoned club setup for club ${clubId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to abandon club setup for club ${clubId}:`, error);
      throw error;
    }
  }
}
