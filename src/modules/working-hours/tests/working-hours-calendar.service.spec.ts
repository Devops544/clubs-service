import { Test, TestingModule } from '@nestjs/testing';
import { WorkingHoursCalendarService } from '../working-hours-calendar.service';

describe('WorkingHoursCalendarService', () => {
  let service: WorkingHoursCalendarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkingHoursCalendarService],
    }).compile();

    service = module.get<WorkingHoursCalendarService>(WorkingHoursCalendarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
