import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsArray,
  IsEmail,
  IsDateString,
} from 'class-validator';
import {
  GenderType,
  TeamMemberStatus,
  PermissionType,
  ClubOwnerType,
} from '../entities/team-member.entity';

export enum TeamMemberSortField {
  NAME = 'name',
  SURNAME = 'surname',
  EMAIL = 'email',
  POSITION = 'position',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  STATUS = 'status',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(TeamMemberSortField, {
  name: 'TeamMemberSortField',
  description: 'Available fields for sorting team members',
});

registerEnumType(SortOrder, {
  name: 'TeamMemberSortOrder',
  description: 'Sort order for team member queries',
});

@InputType()
export class TeamMemberSortInput {
  @Field(() => TeamMemberSortField, { description: 'Field to sort by' })
  @IsEnum(TeamMemberSortField)
  field: TeamMemberSortField;

  @Field(() => SortOrder, {
    description: 'Sort order',
    defaultValue: SortOrder.ASC,
  })
  @IsEnum(SortOrder)
  order: SortOrder;
}

@InputType()
export class TeamMemberPaginationInput {
  @Field({
    nullable: true,
    description: 'Number of items to skip',
    defaultValue: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @Field({
    nullable: true,
    description: 'Number of items to take (max 100)',
    defaultValue: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number;
}

@InputType()
export class TeamMemberDateRangeFilter {
  @Field({ nullable: true, description: 'Start date (ISO string)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @Field({ nullable: true, description: 'End date (ISO string)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

@InputType()
export class TeamMemberFilterInput {
  @Field({ nullable: true, description: 'Filter by team member name' })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true, description: 'Filter by team member surname' })
  @IsOptional()
  @IsString()
  surname?: string;

  @Field({ nullable: true, description: 'Filter by team member email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true, description: 'Filter by phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field({ nullable: true, description: 'Filter by country' })
  @IsOptional()
  @IsString()
  country?: string;

  @Field({ nullable: true, description: 'Filter by position' })
  @IsOptional()
  @IsString()
  position?: string;

  @Field(() => [TeamMemberStatus], { nullable: true, description: 'Filter by status' })
  @IsOptional()
  @IsArray()
  @IsEnum(TeamMemberStatus, { each: true })
  statuses?: TeamMemberStatus[];

  @Field(() => GenderType, { nullable: true, description: 'Filter by gender' })
  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @Field(() => [PermissionType], { nullable: true, description: 'Filter by permissions' })
  @IsOptional()
  @IsArray()
  @IsEnum(PermissionType, { each: true })
  permissions?: PermissionType[];

  @Field(() => ClubOwnerType, { nullable: true, description: 'Filter by club ownership type' })
  @IsOptional()
  @IsEnum(ClubOwnerType)
  club_owner?: ClubOwnerType;

  @Field({ nullable: true, description: 'Filter by club ID' })
  @IsOptional()
  @IsString()
  clubId?: string;

  @Field({
    nullable: true,
    description: 'Full-text search across name, surname, email, position',
  })
  @IsOptional()
  @IsString()
  searchText?: string;

  @Field(() => TeamMemberDateRangeFilter, {
    nullable: true,
    description: 'Filter by creation date',
  })
  @IsOptional()
  createdAt?: TeamMemberDateRangeFilter;

  @Field(() => TeamMemberDateRangeFilter, {
    nullable: true,
    description: 'Filter by last update date',
  })
  @IsOptional()
  updatedAt?: TeamMemberDateRangeFilter;
}

@InputType()
export class TeamMemberQueryInput {
  @Field(() => TeamMemberFilterInput, {
    nullable: true,
    description: 'Filtering options',
  })
  @IsOptional()
  filters?: TeamMemberFilterInput;

  @Field(() => [TeamMemberSortInput], { nullable: true, description: 'Sorting options' })
  @IsOptional()
  @IsArray()
  sort?: TeamMemberSortInput[];

  @Field(() => TeamMemberPaginationInput, { nullable: true, description: 'Pagination options' })
  @IsOptional()
  pagination?: TeamMemberPaginationInput;
}
