import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';
import { ClubFieldFilter } from './club-multi-field-query.input';
import { CreateClubSetupInput } from './create-club-setup.input';

@InputType()
export class ClubFieldQueryInput {
  @Field()
  @IsOptional()
  @IsObject()
  filter: ClubFieldFilter;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relations?: string[];
}

@InputType()
export class ClubFilter extends PartialType(CreateClubSetupInput) {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  id?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  clubId?: string;
  // Additional filter fields for relations
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  amenityId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  locationContactId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  workingHoursCalendarId?: string;
  //Adding other modules fields
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  coachId?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  resourceIds?: string[];
}

@InputType()
export class ClubJsonFieldQueryInput {
  @Field()
  @IsString()
  jsonField: string;

  @Field()
  @IsString()
  jsonPath: string;

  @Field()
  @IsString()
  value: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relations?: string[];
}
