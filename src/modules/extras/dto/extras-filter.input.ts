import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, IsInt, Min, Max, IsArray, IsBoolean } from 'class-validator';
import { ExtrasStatus, UserType, LimitType } from '../entities/extras.entity';

export enum ExtrasSortField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  STATUS = 'status',
  HOUR_BANK_ENABLED = 'hourBankEnabled',
  WISHLIST_ENABLED = 'wishlistEnabled',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(ExtrasSortField, {
  name: 'ExtrasSortField',
  description: 'Available fields for sorting extras configurations',
});

registerEnumType(SortOrder, {
  name: 'ExtrasSortOrder',
  description: 'Sort order for extras queries',
});

@InputType()
export class ExtrasSortInput {
  @Field(() => ExtrasSortField, { description: 'Field to sort by' })
  @IsEnum(ExtrasSortField)
  field: ExtrasSortField;

  @Field(() => SortOrder, {
    description: 'Sort order',
    defaultValue: SortOrder.ASC,
  })
  @IsEnum(SortOrder)
  order: SortOrder;
}

@InputType()
export class ExtrasPaginationInput {
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
export class ExtrasDateRangeFilter {
  @Field({ nullable: true, description: 'Start date (ISO string)' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @Field({ nullable: true, description: 'End date (ISO string)' })
  @IsOptional()
  @IsString()
  endDate?: string;
}

@InputType()
export class ExtrasFilterInput {
  @Field({ nullable: true, description: 'Filter by club ID' })
  @IsOptional()
  @IsString()
  clubId?: string;

  @Field(() => ExtrasStatus, { nullable: true, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(ExtrasStatus)
  status?: ExtrasStatus;

  @Field({ nullable: true, description: 'Filter by hour bank enabled' })
  @IsOptional()
  @IsBoolean()
  hourBankEnabled?: boolean;

  @Field({ nullable: true, description: 'Filter by wishlist enabled' })
  @IsOptional()
  @IsBoolean()
  wishlistEnabled?: boolean;

  @Field({ nullable: true, description: 'Filter by external booking system' })
  @IsOptional()
  @IsString()
  externalBookingSystem?: string;

  @Field({ nullable: true, description: 'Filter by payment gateway' })
  @IsOptional()
  @IsString()
  paymentGateway?: string;

  @Field({ nullable: true, description: 'Filter by email marketing' })
  @IsOptional()
  @IsString()
  emailMarketing?: string;

  @Field({ nullable: true, description: 'Filter by analytics integration' })
  @IsOptional()
  @IsString()
  analyticsIntegration?: string;

  @Field({ nullable: true, description: 'Filter by social media integration' })
  @IsOptional()
  @IsString()
  socialMediaIntegration?: string;

  @Field({
    nullable: true,
    description: 'Full-text search across descriptions and notes',
  })
  @IsOptional()
  @IsString()
  searchText?: string;

  @Field(() => ExtrasDateRangeFilter, {
    nullable: true,
    description: 'Filter by creation date',
  })
  @IsOptional()
  createdAt?: ExtrasDateRangeFilter;

  @Field(() => ExtrasDateRangeFilter, {
    nullable: true,
    description: 'Filter by last update date',
  })
  @IsOptional()
  updatedAt?: ExtrasDateRangeFilter;
}

@InputType()
export class ExtrasQueryInput {
  @Field(() => ExtrasFilterInput, {
    nullable: true,
    description: 'Filtering options',
  })
  @IsOptional()
  filters?: ExtrasFilterInput;

  @Field(() => [ExtrasSortInput], { nullable: true, description: 'Sorting options' })
  @IsOptional()
  @IsArray()
  sort?: ExtrasSortInput[];

  @Field(() => ExtrasPaginationInput, { nullable: true, description: 'Pagination options' })
  @IsOptional()
  pagination?: ExtrasPaginationInput;
}
