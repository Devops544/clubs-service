import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coach } from '../entities/coach.entity';
import { CreateCoachInput } from '../dto/create-coach.input';
import { UpdateCoachInput } from '../dto/update-coach.input';
import { CoachQueryInput } from '../dto/coach-filter.input';

@Injectable()
export class CoachService {
  constructor(
    @InjectRepository(Coach)
    private readonly coachRepository: Repository<Coach>,
  ) {}

  async create(createCoachInput: CreateCoachInput): Promise<Coach> {
    try {
      const coach = this.coachRepository.create(createCoachInput);
      return await this.coachRepository.save(coach);
    } catch (error) {
      throw new BadRequestException(`Failed to create coach: ${error.message}`);
    }
  }

  async findAll(query: CoachQueryInput): Promise<{ data: Coach[]; total: number }> {
    try {
      const queryBuilder = this.coachRepository.createQueryBuilder('coach');

      // Apply filters
      if (query.filters?.clubId) {
        queryBuilder.andWhere('coach.clubId = :clubId', { clubId: query.filters.clubId });
      }

      if (query.filters?.searchText) {
        queryBuilder.andWhere(
          '(coach.name ILIKE :searchText OR coach.surname ILIKE :searchText OR coach.email ILIKE :searchText)',
          { searchText: `%${query.filters.searchText}%` },
        );
      }

      if (query.filters?.gender) {
        queryBuilder.andWhere('coach.gender = :gender', { gender: query.filters.gender });
      }

      if (query.filters?.country) {
        queryBuilder.andWhere('coach.country = :country', { country: query.filters.country });
      }

      if (query.filters?.city) {
        queryBuilder.andWhere('coach.city = :city', { city: query.filters.city });
      }

      if (query.filters?.services && query.filters.services.length > 0) {
        queryBuilder.andWhere('coach.services && :services', { services: query.filters.services });
      }

      // Apply pagination
      const limit = query.pagination?.take || 10;
      const offset = query.pagination?.skip || 0;
      queryBuilder.skip(offset).take(limit);

      // Apply sorting
      if (query.sort && query.sort.length > 0) {
        query.sort.forEach((sortItem, index) => {
          if (index === 0) {
            queryBuilder.orderBy(`coach.${sortItem.field}`, sortItem.order);
          } else {
            queryBuilder.addOrderBy(`coach.${sortItem.field}`, sortItem.order);
          }
        });
      } else {
        queryBuilder.orderBy('coach.createdAt', 'DESC');
      }

      const [data, total] = await queryBuilder.getManyAndCount();

      return { data, total };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch coaches: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<Coach> {
    try {
      const coach = await this.coachRepository.findOne({
        where: { id },
        relations: ['club'],
      });

      if (!coach) {
        throw new NotFoundException(`Coach with ID ${id} not found`);
      }

      return coach;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to fetch coach: ${error.message}`);
    }
  }

  async findByClubId(clubId: string): Promise<Coach[]> {
    try {
      return await this.coachRepository.find({
        where: { clubId },
        relations: ['club'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new BadRequestException(`Failed to fetch coaches for club: ${error.message}`);
    }
  }

  async update(id: string, updateCoachInput: UpdateCoachInput): Promise<Coach> {
    try {
      const coach = await this.findOne(id);

      // Remove id from update data to avoid conflicts
      const { id: _, ...updateData } = updateCoachInput;

      await this.coachRepository.update(id, updateData);

      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update coach: ${error.message}`);
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const coach = await this.findOne(id);

      const result = await this.coachRepository.delete(id);
      return result.affected > 0;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete coach: ${error.message}`);
    }
  }

  async findByService(serviceId: string, clubId?: string): Promise<Coach[]> {
    try {
      const queryBuilder = this.coachRepository
        .createQueryBuilder('coach')
        .leftJoinAndSelect('coach.club', 'club')
        .where(':serviceId = ANY(coach.services)', { serviceId });

      if (clubId) {
        queryBuilder.andWhere('coach.clubId = :clubId', { clubId });
      }

      return await queryBuilder.getMany();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch coaches by service: ${error.message}`);
    }
  }
}
