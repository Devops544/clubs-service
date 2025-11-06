import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, Between } from 'typeorm';
import { TeamMember } from '../entities/team-member.entity';
import { CreateTeamMemberInput } from '../dto/create-team-member.input';
import { UpdateTeamMemberInput } from '../dto/update-team-member.input';
import { TeamMemberQueryInput } from '../dto/team-member-filter.input';
import { TeamMemberSearchResponse } from '../dto/team-member-search-response.dto';
import { ClubSetupService } from '../../club/club.service';
import { SetupStep } from '../../club/entities/club.entity';

@Injectable()
export class TeamMemberService {
  private readonly logger = new Logger(TeamMemberService.name);

  constructor(
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
    private readonly clubSetupService: ClubSetupService,
  ) {}

  async create(createTeamMemberData: Partial<TeamMember>): Promise<TeamMember> {
    try {
      const teamMember = this.teamMemberRepository.create(createTeamMemberData);
      const savedTeamMember = await this.teamMemberRepository.save(teamMember);

      // Update club setup tracking for TEAM_MEMBERS step (final step)
      if (savedTeamMember.clubId) {
        await this.clubSetupService.completeClubSetup({
          clubId: savedTeamMember.clubId,
          finalStep: SetupStep.TEAM_MEMBERS,
        });
      }

      return savedTeamMember;
    } catch (error) {
      this.logger.error('Failed to create team member:', error);
      throw error;
    }
  }

  async findAll(clubId?: string): Promise<TeamMember[]> {
    const where = clubId ? { clubId } : {};
    return this.teamMemberRepository.find({
      where,
      relations: ['club'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<TeamMember | null> {
    return this.teamMemberRepository.findOne({
      where: { id },
      relations: ['club'],
    });
  }

  async findByClubId(clubId: string): Promise<TeamMember[]> {
    return this.teamMemberRepository.find({
      where: { clubId },
      relations: ['club'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: string, clubId?: string): Promise<TeamMember[]> {
    const where: any = { status };
    if (clubId) where.clubId = clubId;

    return this.teamMemberRepository.find({
      where,
      relations: ['club'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByPosition(position: string, clubId?: string): Promise<TeamMember[]> {
    const where: any = { position: Like(`%${position}%`) };
    if (clubId) where.clubId = clubId;

    return this.teamMemberRepository.find({
      where,
      relations: ['club'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByPermissions(permissions: string[], clubId?: string): Promise<TeamMember[]> {
    const where: any = { permissions: In(permissions) };
    if (clubId) where.clubId = clubId;

    return this.teamMemberRepository.find({
      where,
      relations: ['club'],
      order: { createdAt: 'DESC' },
    });
  }

  async findWithAdvancedFilters(query: TeamMemberQueryInput): Promise<TeamMemberSearchResponse> {
    const { filters, sort, pagination } = query;
    const queryBuilder = this.teamMemberRepository.createQueryBuilder('teamMember');

    // Add relations
    queryBuilder.leftJoinAndSelect('teamMember.club', 'club');

    // Apply filters
    if (filters) {
      if (filters.name) {
        queryBuilder.andWhere('teamMember.name ILIKE :name', { name: `%${filters.name}%` });
      }

      if (filters.surname) {
        queryBuilder.andWhere('teamMember.surname ILIKE :surname', {
          surname: `%${filters.surname}%`,
        });
      }

      if (filters.email) {
        queryBuilder.andWhere('teamMember.email ILIKE :email', { email: `%${filters.email}%` });
      }

      if (filters.phone) {
        queryBuilder.andWhere('teamMember.phone ILIKE :phone', { phone: `%${filters.phone}%` });
      }

      if (filters.country) {
        queryBuilder.andWhere('teamMember.country ILIKE :country', {
          country: `%${filters.country}%`,
        });
      }

      if (filters.position) {
        queryBuilder.andWhere('teamMember.position ILIKE :position', {
          position: `%${filters.position}%`,
        });
      }

      if (filters.statuses && filters.statuses.length > 0) {
        queryBuilder.andWhere('teamMember.status IN (:...statuses)', {
          statuses: filters.statuses,
        });
      }

      if (filters.gender) {
        queryBuilder.andWhere('teamMember.gender = :gender', { gender: filters.gender });
      }

      if (filters.permissions && filters.permissions.length > 0) {
        queryBuilder.andWhere('teamMember.permissions && :permissions', {
          permissions: filters.permissions,
        });
      }

      if (filters.club_owner) {
        queryBuilder.andWhere('teamMember.club_owner = :club_owner', {
          club_owner: filters.club_owner,
        });
      }

      if (filters.clubId) {
        queryBuilder.andWhere('teamMember.clubId = :clubId', { clubId: filters.clubId });
      }

      if (filters.searchText) {
        queryBuilder.andWhere(
          '(teamMember.name ILIKE :searchText OR teamMember.surname ILIKE :searchText OR teamMember.email ILIKE :searchText OR teamMember.position ILIKE :searchText)',
          { searchText: `%${filters.searchText}%` },
        );
      }

      if (filters.createdAt) {
        if (filters.createdAt.startDate) {
          queryBuilder.andWhere('teamMember.createdAt >= :startDate', {
            startDate: filters.createdAt.startDate,
          });
        }
        if (filters.createdAt.endDate) {
          queryBuilder.andWhere('teamMember.createdAt <= :endDate', {
            endDate: filters.createdAt.endDate,
          });
        }
      }

      if (filters.updatedAt) {
        if (filters.updatedAt.startDate) {
          queryBuilder.andWhere('teamMember.updatedAt >= :startDate', {
            startDate: filters.updatedAt.startDate,
          });
        }
        if (filters.updatedAt.endDate) {
          queryBuilder.andWhere('teamMember.updatedAt <= :endDate', {
            endDate: filters.updatedAt.endDate,
          });
        }
      }
    }

    // Apply sorting
    if (sort && sort.length > 0) {
      sort.forEach((sortItem, index) => {
        if (index === 0) {
          queryBuilder.orderBy(`teamMember.${sortItem.field}`, sortItem.order);
        } else {
          queryBuilder.addOrderBy(`teamMember.${sortItem.field}`, sortItem.order);
        }
      });
    } else {
      queryBuilder.orderBy('teamMember.createdAt', 'DESC');
    }

    // Apply pagination
    const skip = pagination?.skip || 0;
    const take = pagination?.take || 20;

    queryBuilder.skip(skip).take(take);

    // Execute query
    const [teamMembers, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / take);
    const currentPage = Math.floor(skip / take) + 1;

    return {
      teamMembers,
      total,
      page: currentPage,
      limit: take,
      totalPages,
    };
  }

  async update(id: string, updateTeamMemberInput: UpdateTeamMemberInput): Promise<TeamMember> {
    const teamMember = await this.findOne(id);
    if (!teamMember) {
      throw new NotFoundException(`Team member with ID ${id} not found`);
    }

    Object.assign(teamMember, updateTeamMemberInput);
    return this.teamMemberRepository.save(teamMember);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.teamMemberRepository.delete(id);
    return result.affected > 0;
  }

  async updateStatus(id: string, status: string): Promise<TeamMember> {
    return this.update(id, { status: status as any });
  }

  async updatePermissions(id: string, permissions: string[]): Promise<TeamMember> {
    return this.update(id, { permissions: permissions as any });
  }

  async addPermission(id: string, permission: string): Promise<TeamMember> {
    const teamMember = await this.findOne(id);
    if (!teamMember) {
      throw new NotFoundException(`Team member with ID ${id} not found`);
    }

    const currentPermissions = teamMember.permissions || [];
    if (!currentPermissions.includes(permission as any)) {
      currentPermissions.push(permission as any);
    }

    return this.update(id, { permissions: currentPermissions as any });
  }

  async removePermission(id: string, permission: string): Promise<TeamMember> {
    const teamMember = await this.findOne(id);
    if (!teamMember) {
      throw new NotFoundException(`Team member with ID ${id} not found`);
    }

    const currentPermissions = teamMember.permissions || [];
    const updatedPermissions = currentPermissions.filter((p) => p !== permission);

    return this.update(id, { permissions: updatedPermissions as any });
  }

  async bulkUpdateStatus(ids: string[], status: string): Promise<TeamMember[]> {
    const updatedTeamMembers: TeamMember[] = [];
    for (const id of ids) {
      const teamMember = await this.updateStatus(id, status);
      updatedTeamMembers.push(teamMember);
    }
    return updatedTeamMembers;
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

    return this.teamMemberRepository.count({ where });
  }

  async searchByName(
    searchTerm: string,
    limit: number = 20,
    clubId?: string,
  ): Promise<TeamMember[]> {
    const queryBuilder = this.teamMemberRepository.createQueryBuilder('teamMember');

    queryBuilder
      .where(
        '(teamMember.name ILIKE :searchTerm OR teamMember.surname ILIKE :searchTerm OR teamMember.email ILIKE :searchTerm)',
      )
      .setParameter('searchTerm', `%${searchTerm}%`)
      .limit(limit);

    if (clubId) {
      queryBuilder.andWhere('teamMember.clubId = :clubId', { clubId });
    }

    return queryBuilder.getMany();
  }
}
