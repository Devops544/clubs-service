import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID, Int, Float, registerEnumType, Directive } from '@nestjs/graphql';
import { IsString, IsOptional, IsBoolean, IsEnum, IsArray } from 'class-validator';
import { WorkingHoursCalendar } from '../../working-hours/entities/working-hours-calendar.entity';
import { LocationContact } from '../../contact-details/entities/location-contact.entity';
import { Resource } from '../../resources/entities/resource.entity';
import { Amenity } from '../../resources/entities/amenity.entity';
import { Coach } from '../../coaches/entities/coach.entity';
import { TeamMember } from '../../team-members/entities/team-member.entity';
import { Membership } from '../../memberships/entities/membership.entity';
import { Pricing } from '../../pricing/entities/pricing.entity';
import { PromoCode } from '../../pricing/entities/promocode.entity';
import { UserGroup } from '../../user-groups/entities/user-group.entity';
// Note: Using string references to avoid circular dependencies
// import { Membership } from 'src/modules/memberships/entities/membership.entity';
// import { Pricing } from 'src/modules/pricing/entities/pricing.entity';
// import { PromoCode } from 'src/modules/pricing/entities/promocode.entity';
// import { UserGroup } from 'src/modules/user-groups/entities/user-group.entity';
// import { Coach } from 'src/modules/coaches/entities/coach.entity';
// import { TeamMember } from 'src/modules/team-members/entities/team-member.entity';

// Enums
export enum ClubType {
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
  MULTI_SPORT = 'multi_sport',
  OTHER = 'other',
}

export enum SportsType {
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

export enum AdditionalService {
  RESTAURANT = 'restaurant',
  HOTEL = 'hotel',
  DRINKS = 'drinks',
  FOOD = 'food',
  HOT_SHOWER = 'hot_shower',
  KIDS_ROOM = 'kids_room',
  WIFI = 'wifi',
  BAR = 'bar',
  CHANGING_ROOM = 'changing_room',
  PARKING = 'parking',
  LOCKER_ROOM = 'locker_room',
  PRO_SHOP = 'pro_shop',
  COACHING = 'coaching',
  PHYSIOTHERAPY = 'physiotherapy',
  MASSAGE = 'massage',
  OTHER = 'other',
}

export enum SetupStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export enum SetupStep {
  CLUB_SETUP = 'club_setup', // 1. Basic club information
  LOCATION_CONTACT = 'location_contact', // 2. Location and contact details
  WORKING_HOURS = 'working_hours', // 3. Working hours configuration
  RESOURCES = 'resources', // 4. Resources setup
  AMENITIES = 'amenities', // 5. Amenities setup
  MEMBERSHIPS = 'memberships', // 6. Membership plans
  PRICING = 'pricing', // 7. Pricing and promocodes
  USER_GROUPS = 'user_groups', // 8. User groups and permissions
  EXTRAS_INTEGRATIONS = 'extras_integrations', // 9. Extras and integrations
  COACHES = 'coaches', // 10. Coaches setup
  TEAM_MEMBERS = 'team_members', // 11. Team members (final step)
}

// Note: Removed complex JSONB types - now using individual columns for better SQL performance and filtering

@ObjectType()
@Directive('@key(fields: "id")')
@Entity('club')
export class ClubSetup {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ===== GENERAL INFORMATION COLUMNS =====
  @Field()
  @Column()
  @IsString()
  title: string;
  // TODO:- Name need to be cross-check (Done)
  @Field({ nullable: true, name: 'clubDescription' })
  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  description?: string;
  //TODO:-it should be a string and need to verify from client as well (Done)
  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  @IsString()
  @IsOptional()
  typeOfClub?: string;

  // It should be sport instead of SportsType (number)
  @Field(() => [SportsType], { nullable: true, name: 'setupSports' })
  @Column({ type: 'enum', array: true, enum: SportsType, nullable: true })
  @IsEnum(SportsType, { each: true })
  sports?: SportsType[];
  // TODO:- It should be array of id and will be refering to those present in tournament_backend. (Pending)
  @Field(() => [AdditionalService], { nullable: true })
  @Column({ type: 'enum', array: true, enum: AdditionalService, nullable: true })
  @IsEnum(AdditionalService, { each: true })
  additionalServices?: AdditionalService[];

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: true, default: false })
  @IsBoolean()
  @IsOptional()
  isPartOfChain?: boolean;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  @IsString()
  @IsOptional()
  chainId?: string;

  // ===== APPEARANCE SETTINGS COLUMNS =====
  @Field({ nullable: true, name: 'setupLogo' })
  @Column({ type: 'varchar', nullable: true })
  @IsString()
  @IsOptional()
  logo?: string;

  // ===== GALLERY SETTINGS COLUMNS =====
  @Field(() => [String], { nullable: true })
  @Column({ type: 'text', array: true, nullable: true })
  @IsArray()
  @IsOptional()
  galleryImages?: string[];

  // ===== BOOKING SETTINGS COLUMNS =====
  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  enableOnlineBookings: boolean;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  enableClassBookings: boolean;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  enableOpenMatches: boolean;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  enableAcademyManagement: boolean;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  enableEventManagement: boolean;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  enableLeagueTournamentManagement: boolean;

  // ===== PAYMENT SETTINGS COLUMNS =====
  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  @IsString()
  @IsOptional()
  currency?: string;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  onlinePayment: boolean;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  onsitePayment: boolean;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  byInvoice: boolean;

  @Field({ name: 'setupCreatedAt' })
  @CreateDateColumn()
  createdAt: Date;

  @Field({ name: 'setupUpdatedAt' })
  @UpdateDateColumn()
  updatedAt: Date;

  // ===== SETUP STATUS AND TRACKING FIELDS =====

  @Field(() => SetupStatus, { nullable: true })
  @Column({ type: 'enum', enum: SetupStatus, nullable: true, default: SetupStatus.DRAFT })
  @IsEnum(SetupStatus)
  setupStatus?: SetupStatus;

  @Field(() => SetupStep, { nullable: true })
  @Column({ type: 'enum', enum: SetupStep, nullable: true })
  @IsEnum(SetupStep)
  currentStep?: SetupStep;

  @Field(() => [SetupStep], { nullable: true })
  @Column({ type: 'enum', array: true, enum: SetupStep, nullable: true })
  @IsEnum(SetupStep, { each: true })
  @IsOptional()
  completedSteps?: SetupStep[];

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  lastSavedAt?: Date;

  @Field(() => WorkingHoursCalendar, { nullable: true })
  @OneToOne(() => WorkingHoursCalendar, (workingHoursCalendar) => workingHoursCalendar.club)
  workingHoursCalendar: WorkingHoursCalendar;

  @Field(() => LocationContact, { nullable: true })
  @OneToOne(() => LocationContact, (locationContact) => locationContact.club)
  locationContact: LocationContact;

  @Field(() => Amenity, { nullable: true })
  @OneToOne(() => Amenity, (amenity) => amenity.club)
  amenity: Amenity;

  @Field(() => [Resource], { nullable: true })
  @OneToMany(() => Resource, (resource) => resource.club)
  resources: Resource[];
  @Field(() => [Coach], { nullable: true })
  @OneToMany(() => Coach, (coach) => coach.club)
  coaches: Coach[];
  @Field(() => [TeamMember], { nullable: true })
  @OneToMany(() => TeamMember, (teamMember) => teamMember.club)
  teamMembers: TeamMember[];
  @Field(() => [Membership], { nullable: true })
  @OneToMany(() => Membership, (membership) => membership.club)
  memberships: Membership[];
  @Field(() => [Pricing], { nullable: true })
  @OneToMany(() => Pricing, (pricing) => pricing.club)
  pricing: Pricing[];
  @Field(() => [PromoCode], { nullable: true })
  @OneToMany(() => PromoCode, (promoCode) => promoCode.club)
  promocodes: PromoCode[];
  @Field(() => [UserGroup], { nullable: true })
  @OneToMany(() => UserGroup, (userGroup) => userGroup.club)
  userGroups: UserGroup[];

  // Note: Other modules (memberships, pricing, promocodes, userGroups, coaches, teamMembers)
  // are separate entities that reference club via clubId but are not direct relations in ClubSetup
  // They need to be queried separately using their own resolvers

  // Note: clubId is a reference to the main Club entity in the main service
  // This service only manages club setup data, not the main Club entity
}

// Register enums with GraphQL
registerEnumType(ClubType, {
  name: 'ClubType',
  description: 'Type of club',
});

registerEnumType(SportsType, {
  name: 'SportsType',
  description: 'Type of sports',
});

registerEnumType(AdditionalService, {
  name: 'AdditionalService',
  description: 'Additional services offered by clubs',
});

registerEnumType(SetupStatus, {
  name: 'SetupStatus',
  description: 'Status of club setup process',
});

registerEnumType(SetupStep, {
  name: 'SetupStep',
  description: 'Steps in club setup process',
});
