import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like, In, Between } from 'typeorm';
import { CoachClass } from '../entities/coach-class.entity';
import { CreateCoachClassInput } from '../dto/create-coach-class.input';
import { UpdateCoachClassInput } from '../dto/update-coach-class.input';
import { CoachClassFilterInput } from '../dto/coach-class-filter.input';

@Injectable()
export class CoachClassService {
  constructor(
    @InjectRepository(CoachClass)
    private readonly coachClassRepository: Repository<CoachClass>,
  ) {}

  async create(createCoachClassInput: CreateCoachClassInput): Promise<CoachClass> {
    try {
      const coachClass = this.coachClassRepository.create(createCoachClassInput);
      return await this.coachClassRepository.save(coachClass);
    } catch (error) {
      throw new BadRequestException(`Failed to create coach class: ${error.message}`);
    }
  }

  async findAll(filter: CoachClassFilterInput): Promise<{ data: CoachClass[]; total: number }> {
    try {
      const queryBuilder = this.coachClassRepository.createQueryBuilder('coachClass');

      // Apply filters
      if (filter.title) {
        queryBuilder.andWhere('coachClass.title ILIKE :title', { title: `%${filter.title}%` });
      }

      if (filter.service && filter.service.length > 0) {
        queryBuilder.andWhere('coachClass.service && :service', { service: filter.service });
      }

      if (filter.group && filter.group.length > 0) {
        queryBuilder.andWhere('coachClass.group && :group', { group: filter.group });
      }

      if (filter.resource && filter.resource.length > 0) {
        queryBuilder.andWhere('coachClass.resource && :resource', { resource: filter.resource });
      }

      if (filter.priceType) {
        queryBuilder.andWhere('coachClass.priceType = :priceType', { priceType: filter.priceType });
      }

      if (filter.minPrice !== undefined) {
        queryBuilder.andWhere('coachClass.price >= :minPrice', { minPrice: filter.minPrice });
      }

      if (filter.maxPrice !== undefined) {
        queryBuilder.andWhere('coachClass.price <= :maxPrice', { maxPrice: filter.maxPrice });
      }

      if (filter.coachIds && filter.coachIds.length > 0) {
        queryBuilder.andWhere(
          "EXISTS (SELECT 1 FROM jsonb_array_elements(coachClass.coach) AS coach_item WHERE (coach_item->>'coachId')::uuid = ANY(:coachIds))",
          { coachIds: filter.coachIds },
        );
      }

      // Always filter by clubId
      queryBuilder.andWhere('coachClass.clubId = :clubId', { clubId: filter.clubId });

      // Apply pagination
      const limit = filter.limit || 10;
      const offset = filter.offset || 0;
      queryBuilder.skip(offset).take(limit);

      // Order by creation date
      queryBuilder.orderBy('coachClass.createdAt', 'DESC');

      const [data, total] = await queryBuilder.getManyAndCount();

      return { data, total };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch coach classes: ${error.message}`);
    }
  }

  async findOne(id: string, clubId: string): Promise<CoachClass> {
    try {
      const coachClass = await this.coachClassRepository.findOne({
        where: { id, clubId },
      });

      if (!coachClass) {
        throw new NotFoundException(`Coach class with ID ${id} not found`);
      }

      return coachClass;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to fetch coach class: ${error.message}`);
    }
  }

  async update(
    id: string,
    updateCoachClassInput: UpdateCoachClassInput,
    clubId: string,
  ): Promise<CoachClass> {
    try {
      const coachClass = await this.findOne(id, clubId);

      // Remove id from update data to avoid conflicts
      const { id: _, ...updateData } = updateCoachClassInput;

      await this.coachClassRepository.update(id, updateData);

      return await this.findOne(id, clubId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update coach class: ${error.message}`);
    }
  }

  async remove(id: string, clubId: string): Promise<boolean> {
    try {
      const coachClass = await this.findOne(id, clubId);

      const result = await this.coachClassRepository.delete(id);
      return result.affected > 0;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete coach class: ${error.message}`);
    }
  }

  async findByCoachId(coachId: string, clubId: string): Promise<CoachClass[]> {
    try {
      return await this.coachClassRepository
        .createQueryBuilder('coachClass')
        .where('coachClass.clubId = :clubId', { clubId })
        .andWhere(
          "EXISTS (SELECT 1 FROM jsonb_array_elements(coachClass.coach) AS coach_item WHERE (coach_item->>'coachId')::uuid = :coachId)",
          { coachId },
        )
        .orderBy('coachClass.createdAt', 'DESC')
        .getMany();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch coach classes for coach: ${error.message}`);
    }
  }
}
