import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amenity } from './entities/amenity.entity';
import { AmenityService } from './services/amenity.service';
import { AmenityResolver } from './resolvers/amenity.resolver';
import { Logger } from '@nestjs/common';
import { ClubSetupModule } from '../club/club.module';

@Module({
  imports: [TypeOrmModule.forFeature([Amenity]), ClubSetupModule],
  providers: [AmenityService, AmenityResolver, Logger],
  exports: [AmenityService],
})
export class AmenityModule {}
