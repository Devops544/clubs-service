import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsHexColor,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import {
  ServiceType,
  ResourceType,
  ResourceProperty,
  ResourceStatus,
} from '../entities/resource.entity';

@InputType()
export class CreateResourceInput {
  @Field({ description: 'Title of the resource (e.g., Court #1)' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field(() => ServiceType, { description: 'Type of service offered' })
  @IsEnum(ServiceType)
  service: ServiceType;

  @Field(() => ResourceType, { description: 'Indoor or outdoor resource' })
  @IsEnum(ResourceType)
  type: ResourceType;

  @Field(() => ResourceProperty, { description: 'Surface property of the resource' })
  @IsEnum(ResourceProperty)
  property: ResourceProperty;

  @Field({ nullable: true, description: 'Optional description or notes' })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Boolean, {
    defaultValue: true,
    description: 'Enable online booking for this resource',
  })
  @IsBoolean()
  enableOnlineBooking: boolean;

  @Field({ description: 'Hex color code for calendar display (e.g., #F1C231)' })
  @IsString()
  @IsHexColor()
  color: string;

  @Field(() => ResourceStatus, {
    defaultValue: ResourceStatus.ACTIVE,
    description: 'Current status of the resource',
  })
  @IsEnum(ResourceStatus)
  status: ResourceStatus;

  @Field({ description: 'UUID of the club this resource belongs to' })
  @IsString()
  @IsUUID()
  clubId: string;
}
