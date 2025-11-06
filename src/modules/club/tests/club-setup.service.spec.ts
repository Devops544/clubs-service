import { Test, TestingModule } from '@nestjs/testing';
import { ClubSetupService } from '../club.service';

describe('ClubSetupService', () => {
  let service: ClubSetupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubSetupService],
    }).compile();

    service = module.get<ClubSetupService>(ClubSetupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
