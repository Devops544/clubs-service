import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, Between } from 'typeorm';
import { Extras } from '../entities/extras.entity';
import { CreateExtrasInput } from '../dto/create-extras.input';
import { UpdateExtrasInput } from '../dto/update-extras.input';
import { ExtrasQueryInput } from '../dto/extras-filter.input';
import { ExtrasSearchResponse } from '../dto/extras-search-response.dto';
import { IntegrationStats } from '../dto/integration-stats.dto';
import { ClubSetupService } from '../../club/club.service';
import { SetupStep } from '../../club/entities/club.entity';

@Injectable()
export class ExtrasService {
  private readonly logger = new Logger(ExtrasService.name);

  constructor(
    @InjectRepository(Extras)
    private readonly extrasRepository: Repository<Extras>,
    private readonly clubSetupService: ClubSetupService,
  ) {}

  async create(createExtrasData: Partial<Extras>): Promise<Extras> {
    try {
      const extras = this.extrasRepository.create(createExtrasData);
      const savedExtras = await this.extrasRepository.save(extras);

      return savedExtras;
    } catch (error) {
      this.logger.error('Failed to create extras configuration:', error);
      throw error;
    }
  }

  async findAll(clubId?: string): Promise<Extras[]> {
    const where = clubId ? { clubId } : {};
    return this.extrasRepository.find({
      where,
      relations: ['club'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Extras | null> {
    return this.extrasRepository.findOne({
      where: { id },
      relations: ['club'],
    });
  }

  async findByClubId(clubId: string): Promise<Extras[]> {
    return this.extrasRepository.find({
      where: { clubId },
      relations: ['club'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: string, clubId?: string): Promise<Extras[]> {
    const where: any = { status };
    if (clubId) where.clubId = clubId;

    return this.extrasRepository.find({
      where,
      relations: ['club'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByFeature(feature: string, enabled: boolean, clubId?: string): Promise<Extras[]> {
    const where: any = { [feature]: enabled };
    if (clubId) where.clubId = clubId;

    return this.extrasRepository.find({
      where,
      relations: ['club'],
      order: { createdAt: 'DESC' },
    });
  }

  async findWithAdvancedFilters(query: ExtrasQueryInput): Promise<ExtrasSearchResponse> {
    const { filters, sort, pagination } = query;
    const queryBuilder = this.extrasRepository.createQueryBuilder('extras');

    // Add relations
    queryBuilder.leftJoinAndSelect('extras.club', 'club');

    // Apply filters
    if (filters) {
      if (filters.clubId) {
        queryBuilder.andWhere('extras.clubId = :clubId', { clubId: filters.clubId });
      }

      if (filters.status) {
        queryBuilder.andWhere('extras.status = :status', { status: filters.status });
      }

      if (filters.hourBankEnabled !== undefined) {
        queryBuilder.andWhere('extras.hourBankEnabled = :hourBankEnabled', {
          hourBankEnabled: filters.hourBankEnabled,
        });
      }

      if (filters.wishlistEnabled !== undefined) {
        queryBuilder.andWhere('extras.wishlistEnabled = :wishlistEnabled', {
          wishlistEnabled: filters.wishlistEnabled,
        });
      }

      if (filters.externalBookingSystem) {
        queryBuilder.andWhere('extras.externalBookingSystem ILIKE :externalBookingSystem', {
          externalBookingSystem: `%${filters.externalBookingSystem}%`,
        });
      }

      if (filters.paymentGateway) {
        queryBuilder.andWhere('extras.paymentGateway ILIKE :paymentGateway', {
          paymentGateway: `%${filters.paymentGateway}%`,
        });
      }

      if (filters.emailMarketing) {
        queryBuilder.andWhere('extras.emailMarketing ILIKE :emailMarketing', {
          emailMarketing: `%${filters.emailMarketing}%`,
        });
      }

      if (filters.analyticsIntegration) {
        queryBuilder.andWhere('extras.analyticsIntegration ILIKE :analyticsIntegration', {
          analyticsIntegration: `%${filters.analyticsIntegration}%`,
        });
      }

      if (filters.socialMediaIntegration) {
        queryBuilder.andWhere('extras.socialMediaIntegration ILIKE :socialMediaIntegration', {
          socialMediaIntegration: `%${filters.socialMediaIntegration}%`,
        });
      }

      if (filters.searchText) {
        queryBuilder.andWhere(
          '(extras.hourBankDescription ILIKE :searchText OR extras.wishlistDescription ILIKE :searchText OR extras.notes ILIKE :searchText)',
          { searchText: `%${filters.searchText}%` },
        );
      }

      if (filters.createdAt) {
        if (filters.createdAt.startDate) {
          queryBuilder.andWhere('extras.createdAt >= :startDate', {
            startDate: filters.createdAt.startDate,
          });
        }
        if (filters.createdAt.endDate) {
          queryBuilder.andWhere('extras.createdAt <= :endDate', {
            endDate: filters.createdAt.endDate,
          });
        }
      }

      if (filters.updatedAt) {
        if (filters.updatedAt.startDate) {
          queryBuilder.andWhere('extras.updatedAt >= :startDate', {
            startDate: filters.updatedAt.startDate,
          });
        }
        if (filters.updatedAt.endDate) {
          queryBuilder.andWhere('extras.updatedAt <= :endDate', {
            endDate: filters.updatedAt.endDate,
          });
        }
      }
    }

    // Apply sorting
    if (sort && sort.length > 0) {
      sort.forEach((sortItem, index) => {
        if (index === 0) {
          queryBuilder.orderBy(`extras.${sortItem.field}`, sortItem.order);
        } else {
          queryBuilder.addOrderBy(`extras.${sortItem.field}`, sortItem.order);
        }
      });
    } else {
      queryBuilder.orderBy('extras.createdAt', 'DESC');
    }

    // Apply pagination
    const skip = pagination?.skip || 0;
    const take = pagination?.take || 20;

    queryBuilder.skip(skip).take(take);

    // Execute query
    const [extras, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / take);
    const currentPage = Math.floor(skip / take) + 1;

    return {
      extras,
      total,
      page: currentPage,
      limit: take,
      totalPages,
    };
  }

  async update(id: string, updateExtrasInput: UpdateExtrasInput): Promise<Extras> {
    const extras = await this.findOne(id);
    if (!extras) {
      throw new NotFoundException(`Extras configuration with ID ${id} not found`);
    }

    Object.assign(extras, updateExtrasInput);
    return this.extrasRepository.save(extras);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.extrasRepository.delete(id);
    return result.affected > 0;
  }

  async updateStatus(id: string, status: string): Promise<Extras> {
    return this.update(id, { status: status as any });
  }

  async toggleFeature(id: string, feature: string, enabled: boolean): Promise<Extras> {
    const extras = await this.findOne(id);
    if (!extras) {
      throw new NotFoundException(`Extras configuration with ID ${id} not found`);
    }

    return this.update(id, { [feature]: enabled } as any);
  }

  async bulkUpdateStatus(ids: string[], status: string): Promise<Extras[]> {
    const updatedExtras: Extras[] = [];
    for (const id of ids) {
      const extras = await this.updateStatus(id, status);
      updatedExtras.push(extras);
    }
    return updatedExtras;
  }

  async bulkDelete(ids: string[]): Promise<boolean> {
    for (const id of ids) {
      await this.remove(id);
    }
    return true;
  }

  async getCount(status?: string, clubId?: string): Promise<number> {
    const where: any = {};
    if (status) where.status = status;
    if (clubId) where.clubId = clubId;

    return this.extrasRepository.count({ where });
  }

  async searchByDescription(
    searchTerm: string,
    limit: number = 20,
    clubId?: string,
  ): Promise<Extras[]> {
    const queryBuilder = this.extrasRepository.createQueryBuilder('extras');

    queryBuilder
      .where(
        '(extras.hourBankDescription ILIKE :searchTerm OR extras.wishlistDescription ILIKE :searchTerm OR extras.notes ILIKE :searchTerm)',
      )
      .setParameter('searchTerm', `%${searchTerm}%`)
      .limit(limit);

    if (clubId) {
      queryBuilder.andWhere('extras.clubId = :clubId', { clubId });
    }

    return queryBuilder.getMany();
  }

  async getIntegrationStats(clubId?: string): Promise<IntegrationStats> {
    const queryBuilder = this.extrasRepository.createQueryBuilder('extras');

    if (clubId) {
      queryBuilder.where('extras.clubId = :clubId', { clubId });
    }

    const stats = await queryBuilder
      .select([
        'COUNT(CASE WHEN extras.hourBankEnabled = true THEN 1 END) as hourBankEnabled',
        'COUNT(CASE WHEN extras.wishlistEnabled = true THEN 1 END) as wishlistEnabled',
        'COUNT(CASE WHEN extras.externalBookingSystem IS NOT NULL THEN 1 END) as externalBookingCount',
        'COUNT(CASE WHEN extras.paymentGateway IS NOT NULL THEN 1 END) as paymentGatewayCount',
        'COUNT(CASE WHEN extras.emailMarketing IS NOT NULL THEN 1 END) as emailMarketingCount',
        'COUNT(CASE WHEN extras.analyticsIntegration IS NOT NULL THEN 1 END) as analyticsCount',
        'COUNT(CASE WHEN extras.socialMediaIntegration IS NOT NULL THEN 1 END) as socialMediaCount',
      ])
      .getRawOne();

    return {
      hourBankEnabled: parseInt(stats.hourBankEnabled) || 0,
      wishlistEnabled: parseInt(stats.wishlistEnabled) || 0,
      externalBookingCount: parseInt(stats.externalBookingCount) || 0,
      paymentGatewayCount: parseInt(stats.paymentGatewayCount) || 0,
      emailMarketingCount: parseInt(stats.emailMarketingCount) || 0,
      analyticsCount: parseInt(stats.analyticsCount) || 0,
      socialMediaCount: parseInt(stats.socialMediaCount) || 0,
    };
  }
}
