import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsString, IsOptional, IsBoolean, IsArray, IsEnum, IsDateString } from 'class-validator';
// Note: Using string types instead of enums for better flexibility
import { AdditionalService, SetupStatus, SetupStep } from '../entities/club.entity';

@InputType()
export class CreateClubSetupInput {
  @Field({ nullable: true })
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  typeOfClub?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  sports?: string[];

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  additionalServices?: AdditionalService[];

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isPartOfChain?: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  chainId?: string;

  // ===== APPEARANCE SETTINGS FIELDS =====
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  logo?: string; // URL or key of uploaded logo

  // ===== GALLERY SETTINGS FIELDS =====
  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  galleryImages?: string[]; // URLs or keys of uploaded images

  // ===== BOOKING SETTINGS FIELDS =====
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  enableOnlineBookings?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  enableClassBookings?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  enableOpenMatches?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  enableAcademyManagement?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  enableEventManagement?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  enableLeagueTournamentManagement?: boolean;

  // ===== PAYMENT SETTINGS FIELDS =====
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  currency?: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  onlinePayment?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  onsitePayment?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  byInvoice?: boolean;

  // ===== DRAFT SETUP FIELDS =====
  @Field(() => SetupStatus, { nullable: true })
  @IsEnum(SetupStatus)
  @IsOptional()
  setupStatus?: SetupStatus;

  @Field(() => SetupStep, { nullable: true })
  @IsEnum(SetupStep)
  @IsOptional()
  currentStep?: SetupStep;

  @Field(() => [SetupStep], { nullable: true })
  @IsArray()
  @IsEnum(SetupStep, { each: true })
  @IsOptional()
  completedSteps?: SetupStep[];

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  lastSavedAt?: string;
}

@InputType()
export class UpdateClubSetupInput extends PartialType(CreateClubSetupInput) {}
