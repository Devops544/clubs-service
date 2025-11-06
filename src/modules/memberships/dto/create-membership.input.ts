import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { MembershipStatus, ServiceType } from '../entities/membership.entity';

@InputType()
export class CreateMembershipInput {
  @Field()
  @IsString()
  title: string;

  @Field(() => [String], { description: 'Services offered in this membership' })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true, message: 'Each service ID must be a valid UUID' })
  services: string[];

  @Field({ nullable: true })
  @IsOptional()
  price?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  currency?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  numberOfBookingHours?: number;

  // resourceIds field removed as memberships should be associated with services instead

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  membershipsLimit?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  fixedDiscount?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  periodType?: string | null;

  @Field({ nullable: true })
  @IsOptional()
  startAt?: Date | null;

  @Field({ nullable: true })
  @IsOptional()
  endAt?: Date | null;

  @Field(() => MembershipStatus, { defaultValue: MembershipStatus.ACTIVE })
  @IsOptional()
  @IsEnum(MembershipStatus)
  status?: MembershipStatus;

  @Field()
  @IsString()
  @IsUUID()
  clubId: string;
}
