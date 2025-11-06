import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Int, registerEnumType, Directive } from '@nestjs/graphql';
// import { GraphQLBoolean } from 'graphql';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ClubSetup } from '../../club/entities/club.entity';

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export enum TimeInterval {
  FIFTEEN_MIN = 15,
  THIRTY_MIN = 30,
  SIXTY_MIN = 60,
  NINETY_MIN = 90,
  ONE_TWENTY_MIN = 120,
}

export enum BookingTimeUnit {
  MINUTES = 'minutes',
  HOURS = 'hours',
  DAYS = 'days',
  WEEKS = 'weeks',
}

// Register enums with GraphQL
registerEnumType(DayOfWeek, {
  name: 'DayOfWeek',
  description: 'Days of the week',
});

registerEnumType(TimeInterval, {
  name: 'TimeInterval',
  description: 'Available time intervals for booking',
});

registerEnumType(BookingTimeUnit, {
  name: 'BookingTimeUnit',
  description: 'Units for booking time settings',
});

@ObjectType()
export class WorkingHoursTimeSlot {
  @Field()
  @IsString()
  start: string;

  @Field()
  @IsString()
  end: string;
  // TODO:- IsAvailable isn't present. what is the mean of it.
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

@ObjectType()
export class AvailableDay {
  @Field(() => DayOfWeek)
  @IsEnum(DayOfWeek)
  day: DayOfWeek;

  @Field(() => Boolean)
  @IsBoolean()
  isOpen: boolean;

  @Field(() => [WorkingHoursTimeSlot], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingHoursTimeSlot)
  @IsOptional()
  timeSlots?: WorkingHoursTimeSlot[];
}

@ObjectType()
export class UnavailableDay {
  @Field()
  @IsString()
  date: string;
  // TODO:- IsClosed isn't present. what is the mean of it.
  @Field(() => Boolean)
  @IsBoolean()
  isClosed: boolean;

  @Field(() => [WorkingHoursTimeSlot], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingHoursTimeSlot)
  @IsOptional()
  timeSlots?: WorkingHoursTimeSlot[];
}

@ObjectType()
export class TimeDuration {
  @Field(() => Int)
  @IsNumber()
  value: number;

  @Field(() => BookingTimeUnit)
  @IsEnum(BookingTimeUnit)
  unit: BookingTimeUnit;
}

@ObjectType()
export class CalendarSettings {
  @Field(() => DayOfWeek)
  @IsEnum(DayOfWeek)
  firstDayOfWeek: DayOfWeek;
  // TODO:- It should accept time in minutess from frontend (default_interval_in_mins) (Done)
  @Field(() => Int, { description: 'Default interval in minutes' })
  @IsNumber()
  default_interval_in_mins: number;
  // TODO:- It should accept time in minutess from frontend (min_booking_time_in_mins) (Done)
  @Field(() => Int, { description: 'Minimum booking time in minutes' })
  @IsNumber()
  min_booking_time_in_mins: number;
  // TODO:- It should accept time in hours from frontend (cancellation_buffer_in_hours) (Done)
  @Field(() => Int, { description: 'Cancellation buffer in hours' })
  @IsNumber()
  cancellation_buffer_in_hours: number;
  // TODO:- It should accept time in string from frontend (show_booking_for_in_weeks) (Done)
  @Field({ description: 'Show booking for in weeks' })
  @IsString()
  show_booking_for_in_weeks: string;
}

@ObjectType()
@Directive('@key(fields: "id")')
// TODO:- Name should be club_working_hours (Done)
@Entity('working_hours')
// @Index(['clubId'])
export class WorkingHoursCalendar {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  @IsString()
  clubId: string;

  @OneToOne(() => ClubSetup, (club) => club.workingHoursCalendar)
  @JoinColumn({ name: 'clubId' })
  club: ClubSetup;
  // TODO:- Timezone default should be null
  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true, default: null })
  @IsString()
  @IsOptional()
  timezone?: string;

  // Available Days - Regular weekly schedule
  @Field(() => [AvailableDay])
  @Column({ type: 'jsonb' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailableDay)
  availableDays: AvailableDay[];

  // Unavailable Days - Specific date exceptions
  @Field(() => [UnavailableDay], { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UnavailableDay)
  @IsOptional()
  unavailableDays?: UnavailableDay[];

  @Field(() => CalendarSettings, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  @ValidateNested()
  @Type(() => CalendarSettings)
  @IsOptional()
  calendarSettings?: CalendarSettings;

  // @Field(() => Boolean)
  // @Column({ default: true })
  // @IsBoolean()
  // isActive: boolean;

  // @Field({ nullable: true })
  // @Column({ type: 'text', nullable: true })
  // @IsString()
  // @IsOptional()
  // notes?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  // Note: clubId is a reference to the main Club entity in the main service
  // This service only manages working hours calendar data, not the main Club entity
}
