import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { WorkingHoursCalendarService } from './working-hours-calendar.service';
import { WorkingHoursCalendar } from './entities/working-hours-calendar.entity';
import { UpdateWorkingHoursCalendarInput } from './dto/update-working-hours-calendar.input';
import { CreateWorkingHoursCalendarInput } from './dto/create-working-hours-calendar.input';
import { NotFoundException, Logger, Inject } from '@nestjs/common';

@Resolver(() => WorkingHoursCalendar)
export class WorkingHoursCalendarResolver {
  @Inject(Logger) private readonly logger: Logger = new Logger(WorkingHoursCalendarResolver.name);
  constructor(private readonly workingHoursCalendarService: WorkingHoursCalendarService) {}

  @Query(() => WorkingHoursCalendar, { nullable: true })
  async getWorkingHoursCalendar(
    @Args('clubId', { type: () => String }) clubId: string,
  ): Promise<WorkingHoursCalendar | null> {
    return this.workingHoursCalendarService.findClubById(clubId);
  }

  @Mutation(() => WorkingHoursCalendar)
  async createWorkingHoursCalendar(
    @Args('input') input: CreateWorkingHoursCalendarInput,
  ): Promise<WorkingHoursCalendar> {
    return this.workingHoursCalendarService.create(input);
  }

  @Mutation(() => WorkingHoursCalendar)
  async updateWorkingHoursCalendar(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateWorkingHoursCalendarInput,
  ): Promise<WorkingHoursCalendar> {
    return this.workingHoursCalendarService.update(id, input as any);
  }

  @Mutation(() => String)
  async deleteWorkingHoursCalendar(
    @Args('clubId', { type: () => String }) clubId: string,
  ): Promise<string> {
    try {
      const result = await this.workingHoursCalendarService.delete(clubId);
      if (!result) {
        throw new NotFoundException('Working hours calendar not found');
      } else {
        this.logger.log(`Working hours calendar deleted successfully for id ${clubId}`);
        return 'Working hours calendar deleted successfully';
      }
    } catch (error) {
      this.logger.error(`Failed to delete working hours calendar ${clubId}:`, error);
      throw error;
    }
  }
}
