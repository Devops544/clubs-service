import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationContact } from './entities/location-contact.entity';
import { LocationContactService } from './location-contact.service';
import { LocationContactResolver } from './location-contact.resolver';
import { Logger } from '@nestjs/common';
import { ClubSetupModule } from '../club/club.module';

@Module({
  imports: [TypeOrmModule.forFeature([LocationContact]), ClubSetupModule],
  providers: [LocationContactService, LocationContactResolver, Logger],
  exports: [LocationContactService],
})
export class LocationContactModule {}
