import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsString, IsOptional, IsArray, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum FilterOperator {
  EQUALS = 'equals',
  CONTAINS = 'contains',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
}

// Register the enum with GraphQL
registerEnumType(FilterOperator, {
  name: 'FilterOperator',
  description: 'Available filter operators for field matching',
});

@InputType()
export class ClubFieldFilter {
  @Field(() => String, { description: 'Field name to filter by' })
  @IsString()
  field: string;

  @Field(() => String, { description: 'Value to filter by' })
  @IsString()
  value: string;

  @Field(() => FilterOperator, {
    nullable: true,
    description: 'Filter operator (default: equals)',
    defaultValue: FilterOperator.EQUALS,
  })
  @IsOptional()
  @IsEnum(FilterOperator)
  operator?: FilterOperator;
}

@InputType()
export class ClubMultiFieldQueryInput {
  @Field(() => [ClubFieldFilter], { description: 'Array of field filters' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClubFieldFilter)
  filters: ClubFieldFilter[];

  @Field(() => [String], {
    nullable: true,
    description: 'Relations to include in the response',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relations?: string[];
}
