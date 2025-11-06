import { InputType, Field, Int } from '@nestjs/graphql';
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
import { DayOfWeek } from '../entities/working-hours-calendar.entity';

@InputType()
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

@InputType()
export class WorkingHoursAvailableDayInput {
  @Field(() => DayOfWeek)
  @IsEnum(DayOfWeek)
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

@InputType()
export class WorkingHoursWorkingHoursUnavailableDayInput {
  @Field()
  @IsString()
  date: string;

  @Field(() => Boolean)
  @IsBoolean()
  isClosed: boolean;

  @Field(() => [WorkingHoursTimeSlotInput], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingHoursTimeSlotInput)
  @IsOptional()
  timeSlots?: WorkingHoursTimeSlotInput[];
}

@InputType()
export class WorkingHoursCalendarSettingsInput {
  @Field(() => DayOfWeek)
  @IsEnum(DayOfWeek)
  firstDayOfWeek: DayOfWeek;

  @Field(() => Int, { description: 'Default interval in minutes' })
  @IsNumber()
  default_interval_in_mins: number;

  @Field(() => Int, { description: 'Minimum booking time in minutes' })
  @IsNumber()
  min_booking_time_in_mins: number;

  @Field(() => Int, { description: 'Cancellation buffer in hours' })
  @IsNumber()
  cancellation_buffer_in_hours: number;

  @Field({ description: 'Show booking for in weeks' })
  @IsString()
  show_booking_for_in_weeks: string;
}

@InputType()
export class UpdateWorkingHoursCalendarInput {
  @Field(() => [WorkingHoursAvailableDayInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingHoursAvailableDayInput)
  availableDays: WorkingHoursAvailableDayInput[];

  @Field(() => [WorkingHoursWorkingHoursUnavailableDayInput], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingHoursWorkingHoursUnavailableDayInput)
  @IsOptional()
  unavailableDays?: WorkingHoursWorkingHoursUnavailableDayInput[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  timezone?: string;

  @Field(() => WorkingHoursCalendarSettingsInput, { nullable: true })
  @ValidateNested()
  @Type(() => WorkingHoursCalendarSettingsInput)
  @IsOptional()
  calendarSettings?: WorkingHoursCalendarSettingsInput;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  notes?: string;
}
