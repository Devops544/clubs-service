import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ArrayNotEmpty, IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';

@InputType()
export class CreatePromoCodeInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string | null;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  serviceIds: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  resourceIds?: string[] | null;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  userGroupIds?: string[] | null;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  membershipIds?: string[] | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  promo_period?: string | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  custom_period_number?: number | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  custom_period_string?: string | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  price_type?: string | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  amount?: number | null;

  @Field()
  @IsString()
  @IsUUID()
  clubId: string;
}
