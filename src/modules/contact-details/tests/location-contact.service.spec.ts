import { Test, TestingModule } from '@nestjs/testing';
import { LocationContactService } from '../location-contact.service';

describe('LocationContactService', () => {
  let service: LocationContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationContactService],
    }).compile();

    service = module.get<LocationContactService>(LocationContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
