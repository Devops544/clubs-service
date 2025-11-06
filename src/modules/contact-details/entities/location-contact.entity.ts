import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { IsString, IsOptional, IsEmail, IsUrl } from 'class-validator';
import { ClubSetup } from '../../club/entities/club.entity';

@ObjectType()
@Directive('@key(fields: "id")')
// TODO:- Name should be club_location (keep it as it is)
@Entity('location_contact')
// @Index(['clubId'])
// @Index(['country'])
// @Index(['city'])
export class LocationContact {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  @IsString()
  @IsOptional()
  clubId?: string;

  @OneToOne(() => ClubSetup, (club) => club.locationContact)
  @JoinColumn({ name: 'clubId' })
  club: ClubSetup;

  // --- Location Details (Required) ---
  @Field()
  @Column()
  @IsString()
  address: string;

  @Field()
  @Column()
  @IsString()
  city: string;

  @Field()
  @Column()
  @IsString()
  country: string;

  // --- How to find us ---
  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  // --- Contact Information ---
  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;
  // TODO:- Phonenumber save country code and phone number while phonecountrycode shoulde store country code
  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  phoneCountryCode?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  // --- Website ---
  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsUrl()
  @IsOptional()
  websiteLink?: string;

  // --- Social Media ---
  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  instagramLink?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  tiktokLink?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  facebookLink?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  // Note: clubId is a reference to the main Club entity in the main service
  // This service only manages location contact data, not the main Club entity
}
