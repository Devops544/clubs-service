import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, registerEnumType, Directive } from '@nestjs/graphql';
import { IsString, IsOptional, IsBoolean, IsEnum, IsHexColor } from 'class-validator';
import { ClubSetup } from '../../club/entities/club.entity';

// Enums
export enum ServiceType {
  TENNIS = 'tennis',
  PADEL = 'padel',
  SQUASH = 'squash',
  BADMINTON = 'badminton',
  FOOTBALL = 'football',
  BASKETBALL = 'basketball',
  VOLLEYBALL = 'volleyball',
  FITNESS = 'fitness',
  GYM = 'gym',
  SWIMMING = 'swimming',
  GOLF = 'golf',
  OTHER = 'other',
}

export enum ResourceType {
  INDOOR = 'indoor',
  OUTDOOR = 'outdoor',
}

export enum ResourceProperty {
  CLAY = 'clay',
  HARD = 'hard',
  GRASS = 'grass',
  CARPET = 'carpet',
  CONCRETE = 'concrete',
  WOOD = 'wood',
  SYNTHETIC = 'synthetic',
  OTHER = 'other',
}

export enum ResourceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

// Register enums with GraphQL
registerEnumType(ServiceType, {
  name: 'ResourceServiceType',
  description: 'Type of service offered (scoped to clubs resources)',
});

registerEnumType(ResourceType, {
  name: 'ResourceType',
  description: 'Type of resource (indoor/outdoor)',
});

registerEnumType(ResourceProperty, {
  name: 'ResourceProperty',
  description: 'Property/material of the resource',
});

registerEnumType(ResourceStatus, {
  name: 'ResourceStatus',
  description: 'Status of the resource',
});

@ObjectType('ClubResource')
@Directive('@key(fields: "id")')
@Entity('resource')
// TODO:- Name should be club_resource
export class Resource {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // TODO:- Default value should be no title
  @Field()
  @Column()
  @IsString()
  title: string;
  // TODO:- Service type should be id rather than enum
  @Field(() => ServiceType, { name: 'service', description: 'Resource service type' })
  @Column({
    type: 'enum',
    enum: ServiceType,
  })
  @IsEnum(ServiceType)
  service: ServiceType;
  // TODO:- Type should be string coming from frontend, it can be changed so it is wrong to change the enum from backend
  @Field(() => ResourceType)
  @Column({
    type: 'enum',
    enum: ResourceType,
  })
  @IsEnum(ResourceType)
  type: ResourceType;
  // TODO:- It should be array of string coming from frontend, it can be changed so it is wrong to change the enum from backend
  @Field(() => ResourceProperty)
  @Column({
    type: 'enum',
    enum: ResourceProperty,
  })
  @IsEnum(ResourceProperty)
  property: ResourceProperty;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Boolean)
  @Column({ default: true })
  @IsBoolean()
  enableOnlineBooking: boolean;

  @Field()
  @Column()
  @IsString()
  @IsHexColor()
  color: string;

  @Field(() => ResourceStatus)
  @Column({
    type: 'enum',
    enum: ResourceStatus,
    default: ResourceStatus.ACTIVE,
  })
  @IsEnum(ResourceStatus)
  status: ResourceStatus;

  // Club relationship
  @Field()
  @Column()
  @IsString()
  clubId: string;

  @ManyToOne(() => ClubSetup, (club) => club.resources)
  @JoinColumn({ name: 'clubId' })
  club: ClubSetup;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
  // TODO:- Keep note field as a string(note)
  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  note?: string;
}
