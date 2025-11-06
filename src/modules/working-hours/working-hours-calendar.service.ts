import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkingHoursCalendar } from './entities/working-hours-calendar.entity';
import { ClubSetupService } from '../club/club.service';
import { SetupStep } from '../club/entities/club.entity';

@Injectable()
export class WorkingHoursCalendarService {
  private readonly logger = new Logger(WorkingHoursCalendarService.name);

  constructor(
    @InjectRepository(WorkingHoursCalendar)
    private readonly workingHoursCalendarRepository: Repository<WorkingHoursCalendar>,
    private readonly clubSetupService: ClubSetupService,
  ) {}

  async create(
    createWorkingHoursCalendarData: Partial<WorkingHoursCalendar>,
  ): Promise<WorkingHoursCalendar> {
    try {
      const workingHoursCalendar = this.workingHoursCalendarRepository.create(
        createWorkingHoursCalendarData,
      );
      const savedWorkingHoursCalendar =
        await this.workingHoursCalendarRepository.save(workingHoursCalendar);

      // Update club setup tracking for WORKING_HOURS step
      if (savedWorkingHoursCalendar.clubId) {
        await this.clubSetupService.updateSetupTracking(
          savedWorkingHoursCalendar.clubId,
          SetupStep.WORKING_HOURS,
        );
      }

      return savedWorkingHoursCalendar;
    } catch (error) {
      this.logger.error('Failed to create working hours calendar:', error);
      throw error;
    }
  }

  async findClubById(clubId: string): Promise<WorkingHoursCalendar | null> {
    try {
      return await this.workingHoursCalendarRepository.findOne({
        where: { clubId },
      });
    } catch (error) {
      this.logger.error(`Failed to find working hours calendar for club ${clubId}:`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<WorkingHoursCalendar | null> {
    try {
      return await this.workingHoursCalendarRepository.findOne({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Failed to find working hours calendar with id ${id}:`, error);
      throw error;
    }
  }

  async update(
    id: string,
    updateData: Partial<WorkingHoursCalendar>,
  ): Promise<WorkingHoursCalendar> {
    try {
      const workingHoursCalendar = await this.findById(id);
      if (!workingHoursCalendar) {
        throw new Error(`Working hours calendar with id ${id} not found`);
      }

      Object.assign(workingHoursCalendar, updateData);
      return await this.workingHoursCalendarRepository.save(workingHoursCalendar);
    } catch (error) {
      this.logger.error(`Failed to update working hours calendar with id ${id}:`, error);
      throw error;
    }
  }

  async delete(clubId: string): Promise<boolean> {
    try {
      const result = await this.workingHoursCalendarRepository.delete({ clubId });
      return result.affected > 0;
    } catch (error) {
      this.logger.error(`Failed to delete working hours calendar for club ${clubId}:`, error);
      throw error;
    }
  }
}
