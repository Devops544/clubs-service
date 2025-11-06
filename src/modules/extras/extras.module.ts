import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Extras } from './entities/extras.entity';
import { ExtrasService } from './services/extras.service';
import { ExtrasResolver } from './resolvers/extras.resolver';
import { Logger } from '@nestjs/common';
import { ClubSetupModule } from '../club/club.module';

@Module({
  imports: [TypeOrmModule.forFeature([Extras]), ClubSetupModule],
  providers: [ExtrasService, ExtrasResolver, Logger],
  exports: [ExtrasService],
})
export class ExtrasModule {}
