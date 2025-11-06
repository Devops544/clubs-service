import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from '../entities/membership.entity';
import { CreateMembershipInput } from '../dto/create-membership.input';
import { UpdateMembershipInput } from '../dto/update-membership.input';
import { ClubSetupService } from '../../club/club.service';
import { SetupStep } from '../../club/entities/club.entity';

@Injectable()
export class MembershipService {
  private readonly logger = new Logger(MembershipService.name);

  constructor(
    @InjectRepository(Membership)
    private readonly repo: Repository<Membership>,
    private readonly clubSetupService: ClubSetupService,
  ) {}

  async create(createMembershipData: Partial<Membership>): Promise<Membership> {
    try {
      const created = this.repo.create(createMembershipData);
      const savedMembership = await this.repo.save(created);

      // Update club setup tracking for MEMBERSHIPS step
      if (savedMembership.clubId) {
        await this.clubSetupService.updateSetupTracking(
          savedMembership.clubId,
          SetupStep.MEMBERSHIPS,
        );
      }

      return savedMembership;
    } catch (error) {
      this.logger.error('Failed to create membership:', error);
      throw error;
    }
  }

  async findAll(clubId?: string): Promise<Membership[]> {
    if (clubId) return this.repo.find({ where: { clubId } });
    return this.repo.find();
  }

  async findOne(id: string): Promise<Membership | null> {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: string, input: UpdateMembershipInput): Promise<Membership> {
    const entity = await this.findOne(id);
    if (!entity) throw new NotFoundException('Membership not found');
    const merged = this.repo.merge(entity, input);
    return this.repo.save(merged);
  }

  async remove(id: string): Promise<boolean> {
    const res = await this.repo.delete(id);
    return Boolean(res.affected && res.affected > 0);
  }
}
