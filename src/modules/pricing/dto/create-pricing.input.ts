import { InputType, Field } from '@nestjs/graphql';
import { IsArray, IsOptional, IsString, IsUUID, IsEnum, ArrayNotEmpty } from 'class-validator';
// Use a type-only import to avoid circular dependency and duplicate GraphQL types
import type { DayOfWeek } from '../../working-hours/entities/working-hours-calendar.entity';

@InputType()
export class CreatePricingInput {
  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  @IsEnum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], {
    each: true,
  })
  weekdays?: DayOfWeek[];

  @Field()
  @IsString()
  startTime: string;

  @Field()
  @IsString()
  endTime: string;

  @Field(() => [String], {
    nullable: true,
    description: 'Array of resource IDs that relate to resource titles in the resource module',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: 'Each resource ID must be a valid UUID' })
  resourceIds?: string[] | null;

  @Field({ nullable: true })
  @IsOptional()
  price?: number;

  @Field({ nullable: true })
  @IsOptional()
  currency?: string;

  @Field(() => [String], {
    nullable: true,
    defaultValue: [],
    description: 'Array of user group IDs with default empty array',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: 'Each user group ID must be a valid UUID' })
  userGroupIds?: string[] | null;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: 'Each membership ID must be a valid UUID' })
  membershipIds?: string[] | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  period?: string;

  @Field()
  @IsString()
  @IsUUID()
  clubId: string;
}
