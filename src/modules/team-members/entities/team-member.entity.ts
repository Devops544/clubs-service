import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsDateString,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ClubSetup } from '../../club/entities/club.entity';

export enum GenderType {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum TeamMemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum PermissionType {
  MANAGE_BOOKINGS_MATCHES = 'manage_bookings_matches',
  MANAGE_CUSTOMERS = 'manage_customers',
  MANAGE_FINANCES = 'manage_finances',
  MANAGE_COACHES = 'manage_coaches',
  MANAGE_CLASSES = 'manage_classes',
  MANAGE_COMMUNITIES = 'manage_communities',
  MANAGE_NEWS_GALLERIES = 'manage_news_galleries',
  MANAGE_ANNOUNCEMENTS_NOTIFICATIONS = 'manage_announcements_notifications',
}

export enum ClubOwnerType {
  OWNER = 'owner',
  CO_OWNER = 'co_owner',
  MANAGER = 'manager',
  ADMIN = 'admin',
  MEMBER = 'member',
}

registerEnumType(GenderType, {
  name: 'TeamMemberGenderType',
  description: 'Gender of the team member',
});

registerEnumType(TeamMemberStatus, {
  name: 'TeamMemberStatus',
  description: 'Status of the team member',
});

registerEnumType(PermissionType, {
  name: 'TeamMemberPermissionType',
  description: 'Type of permission for team member',
});

registerEnumType(ClubOwnerType, {
  name: 'ClubOwnerType',
  description: 'Type of club ownership for team member',
});

@ObjectType()
// TODO:- Name should be club_staff (pending)
@Entity('team_member')
export class TeamMember {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  @IsString()
  name: string;

  @Field()
  @Column()
  @IsString()
  surname: string;

  @Field()
  @Column()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  countryCode?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  country?: string;

  @Field(() => GenderType, { nullable: true })
  @Column({ type: 'enum', enum: GenderType, nullable: true })
  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  position?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  avatar?: string;

  @Field(() => TeamMemberStatus)
  @Column({ type: 'enum', enum: TeamMemberStatus, default: TeamMemberStatus.ACTIVE })
  @IsEnum(TeamMemberStatus)
  status: TeamMemberStatus;

  @Field(() => [PermissionType], { description: 'Permissions assigned to the team member' })
  @Column('text', { array: true, default: [] })
  @IsArray()
  @IsEnum(PermissionType, { each: true })
  permissions: PermissionType[];

  @Field(() => ClubOwnerType, {
    nullable: true,
    description: 'Club ownership type for the team member',
  })
  @Column({ type: 'enum', enum: ClubOwnerType, nullable: true })
  @IsOptional()
  @IsEnum(ClubOwnerType)
  club_owner?: ClubOwnerType;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

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
