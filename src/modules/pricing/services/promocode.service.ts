import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromoCode } from '../entities/promocode.entity';
import { CreatePromoCodeInput } from '../dto/create-promocode.input';
import { UpdatePromoCodeInput } from '../dto/update-promocode.input';
import { ClubSetupService } from '../../club/club.service';
import { SetupStep } from '../../club/entities/club.entity';

@Injectable()
export class PromoCodeService {
  private readonly logger = new Logger(PromoCodeService.name);

  constructor(
    @InjectRepository(PromoCode)
    private readonly repo: Repository<PromoCode>,
    private readonly clubSetupService: ClubSetupService,
  ) {}

  async create(input: CreatePromoCodeInput) {
    try {
      const created = this.repo.create(input as any);
      const savedPromoCode = await this.repo.save(created);

      return savedPromoCode;
    } catch (error) {
      this.logger.error('Failed to create promocode:', error);
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

  async update(id: string, input: UpdatePromoCodeInput) {
    const entity = await this.findOne(id);
    if (!entity) throw new NotFoundException('Promo code not found');
    const merged = this.repo.merge(entity, input as any);
    return this.repo.save(merged);
  }

  async remove(id: string) {
    const res = await this.repo.delete(id);
    return Boolean(res.affected && res.affected > 0);
  }
}
