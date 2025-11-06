import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, registerEnumType, Directive, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsUUID,
  ValidateNested,
  Min,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ClubSetup } from '../../club/entities/club.entity';

export enum PriceType {
  PER_CLASS = 'per_class',
  PER_CLIENT = 'per_client',
}

registerEnumType(PriceType, {
  name: 'PriceType',
  description: 'Type of price calculation for the class',
});

@ObjectType('CoachClassAssignment')
@InputType('CoachClassAssignmentInput')
export class CoachAssignment {
  @Field()
  @IsUUID('4')
  coachId: string;

  @Field()
  @IsNumber()
  @Min(0)
  salary: number;

  @Field()
  @IsBoolean()
  addToBalance: boolean;
}

@ObjectType('CoachClass')
@Directive('@key(fields: "id")')
@Entity('coach_classes')
export class CoachClass {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  @IsString()
  title: string;

  @Field(() => [String], { description: 'Array of service IDs' })
  @Column('uuid', { array: true, default: [] })
  @IsArray()
  @IsUUID('4', { each: true })
  service: string[];

  @Field(() => [String], { description: 'Array of group IDs' })
  @Column('uuid', { array: true, default: [] })
  @IsArray()
  @IsUUID('4', { each: true })
  group: string[];

  @Field(() => [String], { description: 'Array of resource IDs' })
  @Column('uuid', { array: true, default: [] })
  @IsArray()
  @IsUUID('4', { each: true })
  resource: string[];

  @Field(() => PriceType, { description: 'Price calculation type' })
  @Column({ type: 'enum', enum: PriceType })
  @IsEnum(PriceType)
  priceType: PriceType;

  @Field()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  @Min(0)
  price: number;

  @Field(() => [CoachAssignment], { description: 'Array of coach assignments' })
  @Column({ type: 'jsonb', default: [] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CoachAssignment)
  coach: CoachAssignment[];

  @Field()
  @Column()
  @IsUUID('4')
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
