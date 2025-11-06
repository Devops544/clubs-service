import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, registerEnumType, Directive, InputType } from '@nestjs/graphql';

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
  IsBoolean,
  IsDateString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ClubSetup } from '../../club/entities/club.entity';
// Use a type-only import to avoid circular dependency and duplicate GraphQL types
import type { DayOfWeek } from '../../working-hours/entities/working-hours-calendar.entity';

export enum CoachStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum SportType {
  TENNIS = 'tennis',
  PADEL = 'padel',
  SQUASH = 'squash',
  BADMINTON = 'badminton',
  BASKETBALL = 'basketball',
  FOOTBALL = 'football',
  VOLLEYBALL = 'volleyball',
}

export enum ServiceType {
  PRIVATE_LESSONS = 'private_lessons',
  GROUP_LESSONS = 'group_lessons',
  ACADEMY_TRAINING = 'academy_training',
  TOURNAMENT_COACHING = 'tournament_coaching',
  FITNESS_TRAINING = 'fitness_training',
}

export enum GenderType {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum LanguageLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  NATIVE = 'native',
}

export enum ClubOwnerType {
  OWNER = 'owner',
  CO_OWNER = 'co_owner',
  MANAGER = 'manager',
  ADMIN = 'admin',
  MEMBER = 'member',
}

// Register enums with GraphQL
registerEnumType(CoachStatus, {
  name: 'CoachStatus',
  description: 'Status of the coach',
});

registerEnumType(SportType, {
  name: 'CoachSportType',
  description: 'Type of sport the coach specializes in',
});

registerEnumType(ServiceType, {
  name: 'CoachServiceType',
  description: 'Type of service the coach provides',
});

registerEnumType(GenderType, {
  name: 'CoachGenderType',
  description: 'Gender of the coach',
});

registerEnumType(LanguageLevel, {
  name: 'CoachLanguageLevel',
  description: 'Language proficiency level',
});

registerEnumType(ClubOwnerType, {
  name: 'CoachClubOwnerType',
  description: 'Type of club ownership for the coach',
});

@ObjectType('CoachLanguageProficiency')
@InputType('CoachLanguageProficiencyInput')
export class LanguageProficiency {
  @Field()
  @IsString()
  language: string;

  @Field(() => LanguageLevel)
  @IsEnum(LanguageLevel)
  level: LanguageLevel;
}

@ObjectType('CoachExperienceCategory')
@InputType('CoachExperienceCategoryInput')
export class ExperienceCategory {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsDateString()
  startDate: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

@ObjectType('CoachWorkingHoursTimeSlot')
@InputType('CoachWorkingHoursTimeSlotInput')
export class WorkingHoursTimeSlotInput {
  @Field()
  @IsString()
  start: string;

  @Field()
  @IsString()
  end: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

@ObjectType('CoachAvailableDay')
@InputType('CoachAvailableDayInput')
export class CoachAvailableDay {
  @Field(() => String)
  @IsEnum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
  day: DayOfWeek;

  @Field(() => Boolean)
  @IsBoolean()
  isOpen: boolean;

  @Field(() => [WorkingHoursTimeSlotInput], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingHoursTimeSlotInput)
  @IsOptional()
  timeSlots?: WorkingHoursTimeSlotInput[];
}

@ObjectType()
@Directive('@key(fields: "id")')
@Entity('coach')
export class Coach {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  //#### Personal Info ####
  @Field()
  @Column()
  @IsString()
  name: string;
  //TODO: required (Done)
  @Field()
  @Column()
  @IsString()
  surname: string;
  //TODO: required (Done)
  @Field()
  @Column()
  @IsEmail()
  email: string;
  //TODO: kep country code as well (Done)
  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  phoneCountryCode?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @Field(() => GenderType, { nullable: true, description: 'Gender of the coach' })
  @Column({ type: 'enum', enum: GenderType, nullable: true })
  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @Field({ nullable: true, description: 'Country where the coach is located' })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  country?: string;

  @Field({ nullable: true, description: 'City where the coach is located' })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  //#### Location & Languages ####
  @Field({ nullable: true, description: 'Full address of the coach' })
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  address?: string;
  //TODO: It should be array of objects (Done)
  @Field(() => [LanguageProficiency], {
    nullable: true,
    description: 'Languages spoken with proficiency levels',
  })
  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageProficiency)
  languages?: LanguageProficiency[];

  // @Field(() => [SportType], { description: 'Sports the coach specializes in' })
  // @Column('text', { array: true, default: [] })
  // @IsEnum(SportType, { each: true })
  // sports: SportType[];

  //#### Services ####
  //TODO: It should be array of id's (Done)
  @Field(() => [String], { description: 'Services the coach provides' })
  @Column('uuid', { array: true, default: [] })
  @IsArray()
  services: string[];

  // @Field(() => [String], { nullable: true, description: 'Groups the coach is assigned to' })
  // @Column('text', { array: true, nullable: true })
  // @IsOptional()
  // @IsArray()
  // groups?: string[];

  // @Field({ nullable: true, description: 'Number of students assigned to the coach' })
  // @Column({ type: 'int', nullable: true, default: 0 })
  // @IsOptional()
  // @IsInt()
  // @Min(0)
  // students?: number;

  // @Field({ nullable: true, description: 'Total booked hours for the coach' })
  // @Column({ type: 'int', nullable: true, default: 0 })
  // @IsOptional()
  // @IsInt()
  // @Min(0)
  // bookedHours?: number;

  // @Field({ nullable: true, description: 'Number of classes the coach conducts' })
  // @Column({ type: 'int', nullable: true, default: 0 })
  // @IsOptional()
  // @IsInt()
  // @Min(0)
  // classes?: number;

  // @Field({ nullable: true, description: 'Bank account or payment information' })
  // @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  // @IsOptional()
  // @IsNumber()
  // bank?: number;

  // @Field({ nullable: true })
  // @Column({ type: 'varchar', length: 8, nullable: true })
  // @IsOptional()
  // @IsString()
  // currency?: string;

  // @Field(() => CoachStatus)
  // @Column({ type: 'enum', enum: CoachStatus, default: CoachStatus.ACTIVE })
  // @IsEnum(CoachStatus)
  // status: CoachStatus;

  // @Field({ nullable: true })
  // @Column({ type: 'text', nullable: true })
  // @IsOptional()
  // @IsString()
  // bio?: string;

  // @Field({ nullable: true })
  // @Column({ type: 'text', nullable: true })
  // @IsOptional()
  // @IsString()
  // certifications?: string;

  //#### Experience  ####
  @Field({ nullable: true, description: 'Education background of the coach' })
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  education?: string;

  //TODO: It should be array of objects(Done)
  @Field(() => [ExperienceCategory], {
    nullable: true,
    description: 'Experience categories with date ranges',
  })
  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceCategory)
  experienceCategories?: ExperienceCategory[];

  // work experience should be array of objects

  //TODO:- Aibak added comment on figma yet to be decided
  @Field({ nullable: true, description: 'Work experience description' })
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  workExperience?: string;

  // #### Online Booking and Availability Fields ####
  @Field({
    nullable: true,
    description: 'Whether online booking is enabled for this coach',
  })
  @Column({ type: 'boolean', default: false })
  @IsOptional()
  @IsBoolean()
  onlineBookingEnabled?: boolean;

  @Field(() => [CoachAvailableDay], {
    nullable: true,
    description: 'Weekly availability schedule',
  })
  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CoachAvailableDay)
  availability?: CoachAvailableDay[];

  @Field({ nullable: true, description: 'Assigned resources/courts for the coach' })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  resources?: string;
  //TODO: Aibak added comment on it (Done)
  @Field(() => String, {
    nullable: true,
    description: 'Holiday schedule and special availability (JSON string)',
  })
  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  holidaySchedule?: string;

  // @Field(() => ClubOwnerType, { nullable: true, description: 'Club ownership type for the coach' })
  // @Column({ type: 'enum', enum: ClubOwnerType, nullable: true })
  // @IsOptional()
  // @IsEnum(ClubOwnerType)
  // club_owner?: ClubOwnerType;

  @Field()
  @Column()
  @IsString()
  clubId: string;

  @ManyToOne(() => ClubSetup, (club) => club.id)
  @JoinColumn({ name: 'clubId' })
  club: ClubSetup;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
