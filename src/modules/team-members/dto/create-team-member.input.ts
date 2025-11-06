import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsDateString,
  IsArray,
  IsUUID,
  IsDate,
} from 'class-validator';
import {
  GenderType,
  TeamMemberStatus,
  PermissionType,
  ClubOwnerType,
} from '../entities/team-member.entity';

@InputType()
export class CreateTeamMemberInput {
  @Field({ description: 'Team member name' })
  @IsString()
  name: string;

  @Field({ description: 'Team member surname' })
  @IsString()
  surname: string;

  @Field({ description: 'Team member email address' })
  @IsEmail()
  email: string;

  @Field({ nullable: true, description: 'Team member phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field({ nullable: true, description: 'Country code for phone number' })
  @IsOptional()
  @IsString()
  countryCode?: string;

  @Field({ nullable: true, description: 'Team member country' })
  @IsOptional()
  @IsString()
  country?: string;

  @Field(() => GenderType, { nullable: true, description: 'Team member gender' })
  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @Field({ nullable: true, description: 'Date of birth' })
  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @Field({ nullable: true, description: 'Team member position/role' })
  @IsOptional()
  @IsString()
  position?: string;

  @Field({ nullable: true, description: 'Team member biography' })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field({ nullable: true, description: 'Team member avatar URL' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @Field(() => TeamMemberStatus, {
    description: 'Team member status',
    defaultValue: TeamMemberStatus.ACTIVE,
  })
  @IsEnum(TeamMemberStatus)
  status: TeamMemberStatus;

  @Field(() => [PermissionType], {
    description: 'Permissions assigned to the team member',
    defaultValue: [],
  })
  @IsArray()
  @IsEnum(PermissionType, { each: true })
  permissions: PermissionType[];

  @Field(() => ClubOwnerType, {
    nullable: true,
    description: 'Club ownership type for the team member',
  })
  @IsOptional()
  @IsEnum(ClubOwnerType)
  club_owner?: ClubOwnerType;

  @Field({ nullable: true, description: 'Additional notes about the team member' })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field({ description: 'Club ID this team member belongs to' })
  @IsString()
  @IsUUID('4')
  clubId: string;
}
