// update-resource.input.ts
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsOptional, IsEnum } from 'class-validator';
import { ResourceStatus } from '../entities/resource.entity';
import { CreateResourceInput } from './create-resource.input';

@InputType()
export class UpdateResourceInput extends PartialType(CreateResourceInput) {
  @Field(() => ResourceStatus, { nullable: true, description: 'Current status of the resource' })
  @IsOptional()
  @IsEnum(ResourceStatus)
  status?: ResourceStatus;
}
