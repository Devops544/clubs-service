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
import { ClubSetup } from '../../club/entities/club.entity';

export enum PromoPriceType {
  DISCOUNT_PERCENT = 'discount_percent',
  DISCOUNT_AMOUNT = 'discount_amount',
}

registerEnumType(PromoPriceType, { name: 'PromoPriceType' });

@InputType('PricingLimitConfigInput')
@ObjectType('PricingLimitConfig')
export class LimitConfig {
  @Field()
  enabled: boolean;

  @Field({ nullable: true })
  limit?: number;
}

@ObjectType('PricingPromoCode')
@Directive('@key(fields: "id")')
@Entity('promocode')
export class PromoCode {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  // @IsString()
  name?: string | null;

  @Field(() => [String])
  @Column('text', { array: true, default: [] })
  serviceIds: string[]; // Services scope

  @Field(() => [String], { nullable: true })
  @Column('uuid', { array: true, nullable: true })
  resourceIds?: string[] | null;

  @Field(() => [String], { nullable: true })
  @Column('uuid', { array: true, nullable: true })
  userGroupIds?: string[] | null;

  @Field(() => [String], { nullable: true })
  @Column('uuid', { array: true, nullable: true })
  membershipIds?: string[] | null;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  promo_period?: string | null;

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  custom_period_number?: number | null;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  custom_period_string?: string | null;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  price_type?: string | null;

  @Field({ nullable: true })
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  amount?: number | null;

  @Field()
  @Column()
  clubId: string;

  @ManyToOne(() => ClubSetup, (club) => club.promocodes)
  @JoinColumn({ name: 'clubId' })
  club: ClubSetup;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
