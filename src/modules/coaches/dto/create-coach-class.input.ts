import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
  IsUUID,
  ValidateNested,
  Min,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PriceType } from '../entities/coach-class.entity';

@InputType('CreateCoachClassAssignmentInput')
export class CreateCoachAssignmentInput {
  @Field()
  @IsUUID('4')
  @IsNotEmpty()
  coachId: string;

  @Field()
  @IsNumber()
  @Min(0)
  salary: number;

  @Field()
  @IsBoolean()
  addToBalance: boolean;
}

@InputType('CreateCoachClassInput')
export class CreateCoachClassInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field(() => [String], { description: 'Array of service IDs' })
  @IsArray()
  @IsUUID('4', { each: true })
  service: string[];

  @Field(() => [String], { description: 'Array of group IDs' })
  @IsArray()
  @IsUUID('4', { each: true })
  group: string[];

  @Field(() => [String], { description: 'Array of resource IDs' })
  @IsArray()
  @IsUUID('4', { each: true })
  resource: string[];

  @Field(() => PriceType, { description: 'Price calculation type' })
  @IsEnum(PriceType)
  priceType: PriceType;

  @Field()
  @IsNumber()
  @Min(0)
  price: number;

  @Field(() => [CreateCoachAssignmentInput], { description: 'Array of coach assignments' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCoachAssignmentInput)
  coach: CreateCoachAssignmentInput[];

  @Field()
  @IsUUID('4')
  @IsNotEmpty()
  clubId: string;
}
