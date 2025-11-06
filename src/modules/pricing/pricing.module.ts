import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pricing } from './entities/pricing.entity';
import { PromoCode } from './entities/promocode.entity';
import { PricingService } from './services/pricing.service';
import { PromoCodeService } from './services/promocode.service';
import { PricingResolver } from './resolvers/pricing.resolver';
import { PromoCodeResolver } from './resolvers/promocode.resolver';
import { Logger } from '@nestjs/common';
import { ClubSetupModule } from '../club/club.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pricing, PromoCode]), ClubSetupModule],
  providers: [PricingService, PromoCodeService, PricingResolver, PromoCodeResolver, Logger],
  exports: [PricingService, PromoCodeService],
})
export class PricingModule {}
