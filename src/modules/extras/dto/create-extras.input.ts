import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  IsNumber,
  IsBoolean,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ExtrasStatus, UserType, LimitType } from '../entities/extras.entity';

@InputType()
export class ExtrasUserLimitInput {
  @Field(() => UserType, { description: 'User type' })
  @IsEnum(UserType)
  userType: UserType;

  @Field({ description: 'Limit value' })
  @IsNumber()
  limitValue: number;

  @Field(() => LimitType, { description: 'Type of limit' })
  @IsEnum(LimitType)
  limitType: LimitType;

  @Field({ nullable: true, description: 'Currency for amount limits' })
  @IsOptional()
  @IsString()
  currency?: string;

  @Field({ nullable: true, description: 'Additional configuration' })
  @IsOptional()
  @IsString()
  configuration?: string;
}

@InputType()
export class CreateExtrasInput {
  @Field({ description: 'Club ID this extras configuration belongs to' })
  @IsString()
  @IsUUID('4')
  clubId: string;

  // ===== HOUR BANK CONFIGURATION =====
  @Field({ description: 'Enable hour bank feature', defaultValue: false })
  @IsBoolean()
  hourBankEnabled: boolean;

  @Field({ nullable: true, description: 'Hour bank description' })
  @IsOptional()
  @IsString()
  hourBankDescription?: string;

  @Field(() => [ExtrasUserLimitInput], {
    description: 'Hour bank limits per user type',
    defaultValue: [],
  })
  @IsArray()
  hourBankLimits: ExtrasUserLimitInput[];

  // ===== WISHLIST CONFIGURATION =====
  @Field({ description: 'Enable wishlist feature', defaultValue: false })
  @IsBoolean()
  wishlistEnabled: boolean;

  @Field({ nullable: true, description: 'Wishlist description' })
  @IsOptional()
  @IsString()
  wishlistDescription?: string;

  @Field(() => [ExtrasUserLimitInput], {
    description: 'Wishlist limits per user type',
    defaultValue: [],
  })
  @IsArray()
  wishlistLimits: ExtrasUserLimitInput[];

  // ===== INTEGRATIONS CONFIGURATION =====
  @Field({ nullable: true, description: 'External booking system integration' })
  @IsOptional()
  @IsString()
  externalBookingSystem?: string;

  @Field({ nullable: true, description: 'Payment gateway integration' })
  @IsOptional()
  @IsString()
  paymentGateway?: string;

  @Field({ nullable: true, description: 'Email marketing integration' })
  @IsOptional()
  @IsString()
  emailMarketing?: string;

  @Field({ nullable: true, description: 'Analytics integration' })
  @IsOptional()
  @IsString()
  analyticsIntegration?: string;

  @Field({ nullable: true, description: 'Social media integration' })
  @IsOptional()
  @IsString()
  socialMediaIntegration?: string;

  // ===== ADDITIONAL FEATURES =====
  @Field({ nullable: true, description: 'Loyalty program configuration' })
  @IsOptional()
  @IsString()
  loyaltyProgram?: string;

  @Field({ nullable: true, description: 'Notification settings' })
  @IsOptional()
  @IsString()
  notificationSettings?: string;

  @Field({ nullable: true, description: 'API keys and secrets' })
  @IsOptional()
  @IsString()
  apiKeys?: string;

  @Field(() => ExtrasStatus, {
    description: 'Extras configuration status',
    defaultValue: ExtrasStatus.ACTIVE,
  })
  @IsEnum(ExtrasStatus)
  status: ExtrasStatus;

  @Field({ nullable: true, description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
