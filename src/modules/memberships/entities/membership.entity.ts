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
import {
  IsString,
  IsOptional,
  IsEnum,
  // IsHexColor,
  IsInt,
  Min,
  Max,
  IsNumber,
  IsArray,
} from 'class-validator';
import { ClubSetup } from '../../club/entities/club.entity';

export enum MembershipStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ServiceType {
  SERVICE_A = 'service_a',
  SERVICE_B = 'service_b',
}

registerEnumType(MembershipStatus, {
  name: 'MembershipStatus',
  description: 'Status of the membership',
});

registerEnumType(ServiceType, {
  name: 'MembershipServiceType',
  description: 'Type of service offered in membership',
});

@ObjectType()
@Directive('@key(fields: "id")')
@Entity('membership')
export class Membership {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  @IsString()
  title: string; // membership name
  // TODO:- Services should be array of id's (Done)
  @Field(() => [String], { description: 'Services offered in this membership' })
  @Column('uuid', { array: true, default: [] })
  @IsArray()
  services: string[];
  //TODO:- Add color field as well

  @Field({ nullable: true })
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  @IsOptional()
  @IsNumber()
  price?: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 8, nullable: true })
  @IsOptional()
  @IsString()
  currency?: string;

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  numberOfBookingHours?: number;
  // TODO:- resourceIds should be resources (Done)
  @Field(() => [String], { nullable: true })
  @Column('uuid', { array: true, nullable: true })
  @IsOptional()
  @IsArray()
  resources?: string[] | null;

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  membershipsLimit?: number;

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  fixedDiscount?: number; // percent

  @Field({ nullable: true, description: 'recurring | specific' })
  @Column({ type: 'varchar', length: 32, nullable: true })
  @IsOptional()
  @IsString()
  periodType?: string | null;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  @IsOptional()
  startAt?: Date | null;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  @IsOptional()
  endAt?: Date | null;

  @Field(() => MembershipStatus)
  @Column({ type: 'enum', enum: MembershipStatus, default: MembershipStatus.ACTIVE })
  @IsEnum(MembershipStatus)
  status: MembershipStatus;

  @Field()
  @Column()
  @IsString()
  clubId: string;

  @ManyToOne(() => ClubSetup, (club) => club.id)
  @JoinColumn({ name: 'clubId' })
  club: ClubSetup;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
