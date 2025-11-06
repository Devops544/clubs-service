import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  IsNumber,
  IsArray,
  IsEmail,
  IsUrl,
  IsUUID,
  IsBoolean,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CoachStatus,
  SportType,
  ServiceType,
  GenderType,
  ClubOwnerType,
  LanguageProficiency,
  ExperienceCategory,
  CoachAvailableDay,
} from '../entities/coach.entity';

@InputType()
export class CreateCoachInput {
  @Field({ description: 'Coach name' })
  @IsString()
  name: string;

  @Field({ description: 'Coach surname' })
  @IsString()
  surname: string;

  @Field({ description: 'Coach email address' })
  @IsEmail()
  email: string;

  @Field({ nullable: true, description: 'Coach phone country code' })
  @IsOptional()
  @IsString()
  phoneCountryCode?: string;

  @Field({ nullable: true, description: 'Coach phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field({ nullable: true, description: 'Coach avatar URL' })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @Field(() => [String], {
    description: 'Services the coach provides',
    defaultValue: [],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  services: string[];

  @Field({ nullable: true, description: 'Years of experience' })
  @IsOptional()
  @IsString()
  experienceYears?: string;

  // Personal Information Fields
  @Field(() => GenderType, { nullable: true, description: 'Coach gender' })
  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @Field({ nullable: true, description: 'Coach country' })
  @IsOptional()
  @IsString()
  country?: string;

  @Field({ nullable: true, description: 'Coach city' })
  @IsOptional()
  @IsString()
  city?: string;

  @Field({ nullable: true, description: 'Coach address' })
  @IsOptional()
  @IsString()
  address?: string;

  // Education and Experience Fields
  @Field({ nullable: true, description: 'Educational background (JSON string)' })
  @IsOptional()
  @IsString()
  education?: string;

  @Field(() => [ExperienceCategory], {
    nullable: true,
    description: 'Experience categories with date ranges',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceCategory)
  experienceCategories?: ExperienceCategory[];

  @Field({ nullable: true, description: 'Work experience details (JSON string)' })
  @IsOptional()
  @IsString()
  workExperience?: string;

  @Field({ nullable: true, description: 'Sports experience and achievements (JSON string)' })
  @IsOptional()
  @IsString()
  sportsExperience?: string;

  // Language Fields
  @Field(() => [LanguageProficiency], {
    nullable: true,
    description: 'Languages spoken with proficiency levels',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageProficiency)
  languages?: LanguageProficiency[];

  // Online Booking and Availability Fields
  @Field({
    nullable: true,
    description: 'Enable online booking for this coach',
    defaultValue: false,
  })
  @IsOptional()
  @IsBoolean()
  onlineBookingEnabled?: boolean;

  @Field(() => [CoachAvailableDay], {
    nullable: true,
    description: 'Weekly availability schedule',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CoachAvailableDay)
  availability?: CoachAvailableDay[];

  @Field({ nullable: true, description: 'Assigned resources/courts for the coach' })
  @IsOptional()
  @IsString()
  resources?: string;

  @Field({ nullable: true, description: 'Holiday schedule and special availability (JSON string)' })
  @IsOptional()
  @IsString()
  holidaySchedule?: string;

  @Field({ description: 'Club ID this coach belongs to' })
  @IsString()
  @IsUUID('4')
  clubId: string;
}
