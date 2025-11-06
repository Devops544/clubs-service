import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsHexColor,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { UserGroupStatus } from '../entities/user-group.entity';

@InputType()
export class CreateUserGroupInput {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  @IsHexColor()
  color: string;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  services: string[];

  @Field({ nullable: true, description: 'Percent discount 0..100' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  fixedDiscount?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxCustomers?: number;

  @Field(() => UserGroupStatus, { defaultValue: UserGroupStatus.ACTIVE })
  @IsEnum(UserGroupStatus)
  status: UserGroupStatus;

  @Field()
  @IsString()
  @IsUUID()
  clubId: string;
}
