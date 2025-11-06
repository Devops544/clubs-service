import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserGroup } from '../entities/user-group.entity';
import { CreateUserGroupInput } from '../dto/create-user-group.input';
import { UpdateUserGroupInput } from '../dto/update-user-group.input';
import { ClubSetupService } from '../../club/club.service';
import { SetupStep } from '../../club/entities/club.entity';

@Injectable()
export class UserGroupService {
  private readonly logger = new Logger(UserGroupService.name);

  constructor(
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
    private readonly clubSetupService: ClubSetupService,
  ) {}

  async create(createUserData: Partial<UserGroup>): Promise<UserGroup> {
    try {
      const created = this.userGroupRepository.create(createUserData);
      const savedUserGroup = await this.userGroupRepository.save(created);

      // Update club setup tracking for USER_GROUPS step
      if (savedUserGroup.clubId) {
        await this.clubSetupService.updateSetupTracking(
          savedUserGroup.clubId,
          SetupStep.USER_GROUPS,
        );
      }

      return savedUserGroup;
    } catch (error) {
      this.logger.error('Failed to create user group:', error);
      throw error;
    }
  }

  async findAll(clubId?: string): Promise<UserGroup[]> {
    if (clubId) {
      return this.userGroupRepository.find({ where: { clubId } });
    }
    return this.userGroupRepository.find();
  }

  async findOne(id: string): Promise<UserGroup | null> {
    return this.userGroupRepository.findOne({ where: { id } });
  }

  async update(id: string, input: UpdateUserGroupInput): Promise<UserGroup> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new NotFoundException('User group not found');
    }
    const merged = this.userGroupRepository.merge(entity, input);
    return await this.userGroupRepository.save(merged);
  }

  async remove(id: string): Promise<boolean> {
    const res = await this.userGroupRepository.delete(id);
    return Boolean(res.affected && res.affected > 0);
  }
}
