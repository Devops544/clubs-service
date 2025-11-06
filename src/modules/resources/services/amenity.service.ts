import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Amenity } from '../entities/amenity.entity';
import { CreateAmenityInput } from '../dto/create-amenity.input';
import { UpdateAmenityInput } from '../dto/update-amenity.input';
import { ClubSetupService } from '../../club/club.service';
import { SetupStep } from '../../club/entities/club.entity';

@Injectable()
export class AmenityService {
  private readonly logger = new Logger(AmenityService.name);

  constructor(
    @InjectRepository(Amenity)
    private readonly amenityRepository: Repository<Amenity>,
    private readonly clubSetupService: ClubSetupService,
  ) {}

  async create(createAmenityData: Partial<Amenity>): Promise<Amenity> {
    try {
      this.logger.log('Creating amenity with input:', JSON.stringify(createAmenityData));
      const amenity = this.amenityRepository.create(createAmenityData);
      this.logger.log('Created amenity entity:', JSON.stringify(amenity));
      const result = await this.amenityRepository.save(amenity);
      this.logger.log('Saved amenity successfully:', JSON.stringify(result));

      // Update club setup tracking for AMENITIES step
      if (result.clubId) {
        await this.clubSetupService.updateSetupTracking(result.clubId, SetupStep.AMENITIES);
      }

      return result;
    } catch (error) {
      this.logger.error('Failed to create amenity:', error);
      throw new BadRequestException(`Failed to create amenity: ${error.message}`);
    }
  }

  async findAll(): Promise<Amenity[]> {
    return this.amenityRepository.find({
      relations: ['club'],
    });
  }

  async findByClubId(clubId: string): Promise<Amenity | null> {
    return this.amenityRepository.findOne({
      where: { clubId },
      relations: ['club'],
    });
  }

  async findOne(id: string): Promise<Amenity> {
    const amenity = await this.amenityRepository.findOne({
      where: { id },
      relations: ['club'],
    });

    if (!amenity) {
      throw new NotFoundException(`Amenity with ID ${id} not found`);
    }

    return amenity;
  }

  async update(id: string, updateAmenityInput: UpdateAmenityInput): Promise<Amenity> {
    const amenity = await this.findOne(id);
    if (!amenity) {
      throw new NotFoundException(`Amenity with ID ${id} not found`);
    }

    Object.assign(amenity, updateAmenityInput);

    return this.amenityRepository.save(amenity);
  }

  async updateByClubId(clubId: string, updateAmenityInput: UpdateAmenityInput): Promise<Amenity> {
    const amenity = await this.findByClubId(clubId);

    if (!amenity) {
      throw new NotFoundException(`Amenity not found for club with ID: ${clubId}`);
    }

    // Update existing amenity
    Object.assign(amenity, updateAmenityInput);
    return this.amenityRepository.save(amenity);
  }

  async remove(id: string): Promise<boolean> {
    const amenity = await this.findOne(id);

    if (!amenity) {
      throw new NotFoundException(`Amenity with ID ${id} not found`);
    }

    await this.amenityRepository.remove(amenity);

    return true;
  }

  async removeByClubId(clubId: string): Promise<boolean> {
    const amenity = await this.findByClubId(clubId);

    if (!amenity) {
      throw new NotFoundException(`Amenity not found for club with ID: ${clubId}`);
    }
    await this.amenityRepository.remove(amenity);

    return true;
  }
}
