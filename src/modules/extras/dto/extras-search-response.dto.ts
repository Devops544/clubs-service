import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Extras } from '../entities/extras.entity';

@ObjectType()
export class ExtrasSearchResponse {
  @Field(() => [Extras], {
    description: 'List of extras configurations matching the search criteria',
  })
  extras: Extras[];

  @Field(() => Int, { description: 'Total number of extras configurations matching the criteria' })
  total: number;

  @Field(() => Int, { description: 'Current page number' })
  page: number;

  @Field(() => Int, { description: 'Number of items per page' })
  limit: number;

  @Field(() => Int, { description: 'Total number of pages' })
  totalPages: number;
}
