import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Logger, Inject, NotFoundException } from '@nestjs/common';
import { ResourceService } from '../services/resource.service';
import { Resource } from '../entities/resource.entity';
import { CreateResourceInput } from '../dto/create-resource.input';
import { UpdateResourceInput } from '../dto/update-resource.input';

@Resolver(() => Resource)
export class ResourceResolver {
  constructor(
    private readonly resourceService: ResourceService,
    @Inject(Logger) private readonly logger: Logger,
  ) {}

  @Mutation(() => Resource)
  async createResource(@Args('input') input: CreateResourceInput): Promise<Resource> {
    try {
      return this.resourceService.create(input);
    } catch (error) {
      this.logger.error('Failed to create resource:', error);
      throw error;
    }
  }

  @Query(() => [Resource])
  async getResources(): Promise<Resource[]> {
    try {
      return this.resourceService.findAll();
    } catch (error) {
      this.logger.error('Failed to fetch resources:', error);
      throw error;
    }
  }

  @Query(() => [Resource])
  async getResourcesByClubId(
    @Args('clubId', { type: () => String }) clubId: string,
  ): Promise<Resource[]> {
    try {
      return this.resourceService.findByClubId(clubId);
    } catch (error) {
      this.logger.error(`Failed to fetch resources for club ${clubId}:`, error);
      throw error;
    }
  }

  @Query(() => Resource, { nullable: true })
  async getResource(@Args('id', { type: () => String }) id: string): Promise<Resource | null> {
    try {
      return this.resourceService.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to find resource with id ${id}:`, error);
      throw error;
    }
  }

  @Mutation(() => Resource)
  async updateResource(
    @Args('id', { type: () => String }) id: string,
    @Args('input') input: UpdateResourceInput,
  ): Promise<Resource> {
    try {
      return this.resourceService.update(id, input);
    } catch (error) {
      this.logger.error(`Failed to update resource ${id}:`, error);
      throw error;
    }
  }

  @Mutation(() => String)
  async deleteResource(@Args('id', { type: () => String }) id: string): Promise<string> {
    try {
      const result = await this.resourceService.remove(id);
      if (!result) {
        throw new NotFoundException('Resource not found');
      } else {
        this.logger.log(`Resource deleted successfully for id ${id}`);
        return 'Resource deleted successfully';
      }
    } catch (error) {
      this.logger.error(`Failed to delete resource ${id}:`, error);
      throw error;
    }
  }

  @Query(() => [Resource])
  async getResourcesByService(
    @Args('service', { type: () => String }) service: string,
  ): Promise<Resource[]> {
    try {
      return this.resourceService.findByService(service);
    } catch (error) {
      this.logger.error(`Failed to fetch resources by service ${service}:`, error);
      throw error;
    }
  }

  @Query(() => [Resource])
  async getResourcesByStatus(
    @Args('status', { type: () => String }) status: string,
  ): Promise<Resource[]> {
    try {
      return this.resourceService.findByStatus(status);
    } catch (error) {
      this.logger.error(`Failed to fetch resources by status ${status}:`, error);
      throw error;
    }
  }
}
