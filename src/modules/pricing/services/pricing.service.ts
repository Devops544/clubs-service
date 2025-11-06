import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pricing } from '../entities/pricing.entity';
import { CreatePricingInput } from '../dto/create-pricing.input';
import { UpdatePricingInput } from '../dto/update-pricing.input';
import { ClubSetupService } from '../../club/club.service';
import { SetupStep } from '../../club/entities/club.entity';

@Injectable()
export class PricingService {
  private readonly logger = new Logger(PricingService.name);

  constructor(
    @InjectRepository(Pricing)
    private readonly repo: Repository<Pricing>,
    private readonly clubSetupService: ClubSetupService,
  ) {}

  async create(createPricingData: Partial<Pricing>) {
    try {
      const created = this.repo.create(createPricingData as any);
      const savedPricing = await this.repo.save(created);

      // Update club setup tracking for PRICING step
      const pricing = Array.isArray(savedPricing) ? savedPricing[0] : savedPricing;
      if (pricing && pricing.clubId) {
        await this.clubSetupService.updateSetupTracking(pricing.clubId, SetupStep.PRICING);
      }

      return savedPricing;
    } catch (error) {
      this.logger.error('Failed to create pricing:', error);
      throw error;
    }
  }

  findAll(clubId?: string) {
    if (clubId) return this.repo.find({ where: { clubId } });
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: string, input: UpdatePricingInput) {
    const entity = await this.findOne(id);
    if (!entity) throw new NotFoundException('Pricing not found');
    const merged = this.repo.merge(entity, input as any);
    return this.repo.save(merged);
  }

  async remove(id: string) {
    const res = await this.repo.delete(id);
    return Boolean(res.affected && res.affected > 0);
  }
}
