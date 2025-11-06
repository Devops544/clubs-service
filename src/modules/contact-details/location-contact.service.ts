import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationContact } from './entities/location-contact.entity';
import { ClubSetupService } from '../club/club.service';
import { SetupStep } from '../club/entities/club.entity';

@Injectable()
export class LocationContactService {
  private readonly logger = new Logger(LocationContactService.name);

  constructor(
    @InjectRepository(LocationContact)
    private readonly locationContactRepository: Repository<LocationContact>,
    private readonly clubSetupService: ClubSetupService,
  ) {}

  async create(createLocationContactData: Partial<LocationContact>): Promise<LocationContact> {
    try {
      const locationContact = this.locationContactRepository.create(createLocationContactData);
      const savedLocationContact = await this.locationContactRepository.save(locationContact);

      // Update club setup tracking for LOCATION_CONTACT step
      if (savedLocationContact.clubId) {
        await this.clubSetupService.updateSetupTracking(
          savedLocationContact.clubId,
          SetupStep.LOCATION_CONTACT,
        );
      }

      return savedLocationContact;
    } catch (error) {
      this.logger.error('Failed to create location contact:', error);
      throw error;
    }
  }

  async findClubById(clubId: string): Promise<LocationContact | null> {
    try {
      return await this.locationContactRepository.findOne({
        where: { clubId: clubId },
      });
    } catch (error) {
      this.logger.error(`Failed to find location contact for club ${clubId}:`, error);
      throw error;
    }
  }

  async update(clubId: string, updateData: Partial<LocationContact>): Promise<LocationContact> {
    try {
      const locationContact = await this.findClubById(clubId);
      if (!locationContact) {
        // Create new location contact with the provided clubId
        const newLocationContact = { ...updateData, clubId };
        return this.create(newLocationContact);
      }

      Object.assign(locationContact, updateData);
      return await this.locationContactRepository.save(locationContact);
    } catch (error) {
      this.logger.error(`Failed to update location contact for club ${clubId}:`, error);
      throw error;
    }
  }

  async delete(clubId: string): Promise<boolean> {
    try {
      const result = await this.locationContactRepository.delete({ clubId: clubId });
      return result.affected > 0;
    } catch (error) {
      this.logger.error(`Failed to delete location contact for club ${clubId}:`, error);
      throw error;
    }
  }
}
