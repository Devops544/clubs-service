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
  IsInt,
  Min,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ClubSetup } from '../../club/entities/club.entity';

export enum ExtrasStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum UserType {
  DEFAULT = 'default',
  REGULAR = 'regular',
  PREMIUM = 'premium',
  VIP = 'vip',
}

export enum LimitType {
  HOURS = 'hours',
  AMOUNT = 'amount',
  PERCENTAGE = 'percentage',
}

registerEnumType(ExtrasStatus, {
  name: 'ExtrasStatus',
  description: 'Status of the extras configuration',
});

registerEnumType(UserType, {
  name: 'ExtrasUserType',
  description: 'Type of user for extras limits',
});

registerEnumType(LimitType, {
  name: 'ExtrasLimitType',
  description: 'Type of limit for extras',
});

@ObjectType()
@Directive('@key(fields: "id")')
@Entity('extras')
export class Extras {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  @IsString()
  clubId: string;

  @ManyToOne(() => ClubSetup, (club) => club.id)
  @JoinColumn({ name: 'clubId' })
  club: ClubSetup;

  // ===== HOUR BANK CONFIGURATION =====
  // TODO:- name should be hour_bank (Done)
  @Field({ description: 'Enable hour bank feature' })
  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  hourBank: boolean;
  // TODO:- No use of this (Done)
  // @Field({ nullable: true, description: 'Hour bank description' })
  // @Column({ type: 'text', nullable: true })
  // @IsOptional()
  // @IsString()
  // hourBankDescription?: string;

  @Field(() => [ExtrasUserLimit], { description: 'Hour bank limits per user type' })
  @Column({ type: 'jsonb', default: [] })
  @IsArray()
  hourBankLimits: ExtrasUserLimit[];
  // TODO:- Whishlist name only (Done)
  // ===== WISHLIST CONFIGURATION =====
  @Field({ description: 'Enable wishlist feature' })
  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  wishlist: boolean;

  @Field({ nullable: true, description: 'Wishlist description' })
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  wishlistDescription?: string;

  @Field(() => [ExtrasUserLimit], { description: 'Wishlist limits per user type' })
  @Column({ type: 'jsonb', default: [] })
  @IsArray()
  wishlistLimits: ExtrasUserLimit[];

  // ===== INTEGRATIONS CONFIGURATION =====
  @Field({ nullable: true, description: 'External booking system integration' })
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  externalBookingSystem?: string;

  @Field({ nullable: true, description: 'Payment gateway integration' })
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  paymentGateway?: string;

  @Field({ nullable: true, description: 'Email marketing integration' })
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  emailMarketing?: string;

  @Field({ nullable: true, description: 'Analytics integration' })
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  analyticsIntegration?: string;

  @Field({ nullable: true, description: 'Social media integration' })
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  socialMediaIntegration?: string;

  // ===== ADDITIONAL FEATURES =====
  @Field({ nullable: true, description: 'Loyalty program configuration' })
  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  loyaltyProgram?: string;

  @Field({ nullable: true, description: 'Notification settings' })
  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  notificationSettings?: string;

  @Field({ nullable: true, description: 'API keys and secrets' })
  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  apiKeys?: string;

  @Field(() => ExtrasStatus)
  @Column({ type: 'enum', enum: ExtrasStatus, default: ExtrasStatus.ACTIVE })
  @IsEnum(ExtrasStatus)
  status: ExtrasStatus;

  @Field({ nullable: true, description: 'Additional notes' })
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}

@ObjectType()
export class ExtrasUserLimit {
  @Field(() => UserType, { description: 'User type' })
  userType: UserType;

  @Field({ description: 'Limit value' })
  limitValue: number;

  @Field(() => LimitType, { description: 'Type of limit' })
  limitType: LimitType;

  @Field({ nullable: true, description: 'Currency for amount limits' })
  currency?: string;

  @Field({ nullable: true, description: 'Additional configuration' })
  configuration?: string;
}
