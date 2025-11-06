import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkingHoursCalendar } from './entities/working-hours-calendar.entity';
import { WorkingHoursCalendarService } from './working-hours-calendar.service';
import { WorkingHoursCalendarResolver } from './working-hours-calendar.resolver';
import { Logger } from '@nestjs/common';
import { ClubSetupModule } from '../club/club.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkingHoursCalendar]), forwardRef(() => ClubSetupModule)],
  providers: [WorkingHoursCalendarService, WorkingHoursCalendarResolver, Logger],
  exports: [WorkingHoursCalendarService],
})
export class WorkingHoursCalendarModule {}
