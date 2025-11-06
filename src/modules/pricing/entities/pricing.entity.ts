import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, ID, registerEnumType, Directive } from '@nestjs/graphql';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ClubSetup } from '../../club/entities/club.entity';
// Use a type-only import to avoid circular dependency and duplicate GraphQL types
import type { DayOfWeek } from '../../working-hours/entities/working-hours-calendar.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity('pricing')
export class Pricing {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => [String], { nullable: true })
  @Column('text', { array: true, default: [] })
  @IsEnum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], {
    each: true,
  })
  weekdays: DayOfWeek[]; // e.g., Mon, Tue

  @Field()
  @Column({ type: 'time' })
  startTime: string; // HH:MM

  @Field()
  @Column({ type: 'time' })
  endTime: string; // HH:MM

  @Field(() => [String], { nullable: true })
  @Column('uuid', { array: true, nullable: true })
  resourceIds?: string[] | null;

  @Field({ nullable: true })
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  price?: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 8, nullable: true })
  currency?: string; // €, $, etc

  @Field(() => [String], { nullable: true })
  @Column('uuid', { array: true, nullable: true })
  userGroupIds?: string[] | null;

  @Field(() => [String], { nullable: true })
  @Column('uuid', { array: true, nullable: true })
  membershipIds?: string[] | null;

  @Field(() => String)
  @Column({ type: 'varchar', length: 20, default: 'single' })
  @IsString()
  type: string;

  // @Field({ nullable: true })
  // @Column({ type: 'timestamptz', nullable: true })
  // startAt?: Date | null;

  // @Field({ nullable: true })
  // @Column({ type: 'timestamptz', nullable: true })
  // endAt?: Date | null;
  @Field(() => String)
  @Column({ type: 'varchar', length: 20, default: 'single' })
  @IsString()
  period: string;

  // @Field({ nullable: true })
  // @Column({ type: 'timestamptz', nullable: true })
  // @IsOptional()
  // startAt?: Date | null;

  // @Field({ nullable: true })
  // @Column({ type: 'timestamptz', nullable: true })
  // @IsOptional()
  // endAt?: Date | null;

  @Field()
  @Column()
  @IsString()
  clubId: string;

  @ManyToOne(() => ClubSetup, (club) => club.pricing)
  @JoinColumn({ name: 'clubId' })
  club: ClubSetup;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
