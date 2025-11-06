import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsEmail, IsUrl } from 'class-validator';

@InputType()
export class UpdateLocationContactInput {
  // --- Club Association ---
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  clubId?: string;

  // --- Location Details ---
  @Field()
  @IsString()
  address: string;

  @Field()
  @IsString()
  city: string;

  @Field()
  @IsString()
  country: string;

  // --- How to find us ---
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  // --- Contact Information ---
  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phoneCountryCode?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  // --- Website ---
  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  websiteLink?: string;

  // --- Social Media ---
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  instagramLink?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  tiktokLink?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  facebookLink?: string;
}
