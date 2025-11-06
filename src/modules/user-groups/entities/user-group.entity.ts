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
  IsHexColor,
  IsInt,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { ClubSetup } from '../../club/entities/club.entity';

export enum UserGroupStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

registerEnumType(UserGroupStatus, {
  name: 'UserGroupStatus',
  description: 'Status of the user group',
});

@ObjectType('ClubUserGroup')
@Directive('@key(fields: "id")')
// TODO:- Name should be club_user_group (pending)
@Entity('user_group')
export class UserGroup {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ description: 'User group title' })
  @Column()
  @IsString()
  title: string;

  @Field({ description: 'Hex color used to represent the group' })
  @Column()
  @IsString()
  @IsHexColor()
  color: string;
  // TODO:- Services should be array of id's (Done)
  @Field(() => [String], { description: 'Services this group applies to' })
  @Column('uuid', { array: true, default: [] })
  @IsArray()
  services: string[];

  @Field({
    nullable: true,
    description: 'Fixed discount value as percentage string e.g. 10% or number 10',
  })
  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  fixedDiscount?: number;

  @Field({ nullable: true, description: 'Maximum number of customers allowed in group' })
  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxCustomers?: number;

  @Field(() => UserGroupStatus, { description: 'Current status of the group' })
  @Column({ type: 'enum', enum: UserGroupStatus, default: UserGroupStatus.ACTIVE })
  @IsEnum(UserGroupStatus)
  status: UserGroupStatus;

  @Field({ description: 'Owning club id' })
  @Column()
  @IsString()
  clubId: string;

  // membership-specific fields were moved to separate module

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
