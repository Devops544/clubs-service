import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coach } from './entities/coach.entity';
import { CoachClass } from './entities/coach-class.entity';
import { CoachService } from './services/coach.service';
import { CoachClassService } from './services/coach-class.service';
import { CoachResolver } from './resolvers/coach.resolver';
import { CoachClassResolver } from './resolvers/coach-class.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Coach, CoachClass])],
  providers: [CoachService, CoachClassService, CoachResolver, CoachClassResolver],
  exports: [CoachService, CoachClassService],
})
export class CoachesModule {}
