import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, IsInt, Min, Max, IsArray, IsUUID } from 'class-validator';
import { GenderType } from '../entities/coach.entity';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum CoachSortField {
  NAME = 'name',
  SURNAME = 'surname',
  EMAIL = 'email',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

// Register enums with GraphQL
registerEnumType(SortOrder, {
  name: 'CoachSortOrder',
  description: 'Sort order for coach queries',
});

registerEnumType(CoachSortField, {
  name: 'CoachSortField',
  description: 'Available fields for sorting coaches',
});

@InputType()
export class CoachSortInput {
  @Field(() => CoachSortField, { description: 'Field to sort by' })
  @IsEnum(CoachSortField)
  field: CoachSortField;

  @Field(() => SortOrder, {
    description: 'Sort order',
    defaultValue: SortOrder.ASC,
  })
  @IsEnum(SortOrder)
  order: SortOrder;
}

@InputType()
export class CoachPaginationInput {
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
export class CoachFilterInput {
  @Field({ nullable: true, description: 'Search text for name, surname, email' })
  @IsOptional()
  @IsString()
  searchText?: string;

  @Field({ nullable: true, description: 'Filter by club ID' })
  @IsOptional()
  @IsUUID('4')
  clubId?: string;

  @Field(() => GenderType, { nullable: true, description: 'Filter by gender' })
  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @Field({ nullable: true, description: 'Filter by country' })
  @IsOptional()
  @IsString()
  country?: string;

  @Field({ nullable: true, description: 'Filter by city' })
  @IsOptional()
  @IsString()
  city?: string;

  @Field(() => [String], { nullable: true, description: 'Filter by service IDs' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  services?: string[];
}

@InputType()
export class CoachQueryInput {
  @Field(() => CoachFilterInput, {
    nullable: true,
    description: 'Filtering options',
  })
  @IsOptional()
  filters?: CoachFilterInput;

  @Field(() => [CoachSortInput], { nullable: true, description: 'Sorting options' })
  @IsOptional()
  @IsArray()
  sort?: CoachSortInput[];

  @Field(() => CoachPaginationInput, { nullable: true, description: 'Pagination options' })
  @IsOptional()
  pagination?: CoachPaginationInput;
}
