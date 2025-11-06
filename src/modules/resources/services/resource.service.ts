import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../entities/resource.entity';
import { CreateResourceInput } from '../dto/create-resource.input';
import { UpdateResourceInput } from '../dto/update-resource.input';
import { RESOURCE_CONSTANTS } from '../constants/resource.constants';
import { ClubSetupService } from '../../club/club.service';
import { SetupStep } from '../../club/entities/club.entity';

@Injectable()
export class ResourceService {
  private readonly logger = new Logger(ResourceService.name);

  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    private readonly clubSetupService: ClubSetupService,
  ) {}

  async create(createResourceData: Partial<Resource>): Promise<Resource> {
    try {
      const resource = this.resourceRepository.create(createResourceData);
      const savedResource = await this.resourceRepository.save(resource);

      // Update club setup tracking for RESOURCES step
      if (savedResource.clubId) {
        await this.clubSetupService.updateSetupTracking(savedResource.clubId, SetupStep.RESOURCES);
      }

      return savedResource;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(RESOURCE_CONSTANTS.ERROR_MESSAGES.FAILED_TO_CREATE_RESOURCE);
    }
  }

  async findAll(): Promise<Resource[]> {
    return this.resourceRepository.find({
      relations: ['club'],
    });
  }

  async findByClubId(clubId: string): Promise<Resource[]> {
    return this.resourceRepository.find({
      where: { clubId },
      relations: ['club'],
    });
  }

  async findOne(id: string): Promise<Resource> {
    const resource = await this.resourceRepository.findOne({
      where: { id },
      relations: ['club'],
    });

    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    return resource;
  }

  async update(id: string, updateResourceInput: UpdateResourceInput): Promise<Resource> {
    const resource = await this.findOne(id);

    Object.assign(resource, updateResourceInput);

    return this.resourceRepository.save(resource);
  }

  async remove(id: string): Promise<boolean> {
    const resource = await this.findOne(id);

    await this.resourceRepository.remove(resource);

    return true;
  }

  async findByService(service: string): Promise<Resource[]> {
    return this.resourceRepository.find({
      where: { service: service as any },
      relations: ['club'],
    });
  }

  async findByStatus(status: string): Promise<Resource[]> {
    return this.resourceRepository.find({
      where: { status: status as any },
      relations: ['club'],
    });
  }

  private isValidHexColor(color: string): boolean {
    return RESOURCE_CONSTANTS.VALIDATION.HEX_COLOR_REGEX.test(color);
  }
}
