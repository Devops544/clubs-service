import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { IsBoolean } from 'class-validator';
import { ClubSetup } from '../../club/entities/club.entity';

@ObjectType()
@Directive('@key(fields: "id")')
// TODO:- Name should be club_amenity
@Entity('amenity')
export class Amenity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Club relationship
  @Field()
  @Column()
  clubId: string;

  @OneToOne(() => ClubSetup, (club) => club.amenity)
  @JoinColumn({ name: 'clubId' })
  club: ClubSetup;
  // TODO:- All amenties types should be array of id's (Pending)
  // Amenity boolean fields
  @Field(() => Boolean)
  @Column({ default: false })
  @IsBoolean()
  restaurant: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  @IsBoolean()
  hotel: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  @IsBoolean()
  drinks: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  @IsBoolean()
  food: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  @IsBoolean()
  hotShower: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  @IsBoolean()
  kidsRoom: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  @IsBoolean()
  wifi: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  @IsBoolean()
  bar: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  @IsBoolean()
  changingRoom: boolean;

  // @Field(() => Boolean)
  // @Column({ default: false })
  // @IsBoolean()
  // parking: boolean;

  // @Field(() => Boolean)
  // @Column({ default: false })
  // @IsBoolean()
  // lockerRoom: boolean;

  // @Field(() => Boolean)
  // @Column({ default: false })
  // @IsBoolean()
  // proShop: boolean;

  // @Field(() => Boolean)
  // @Column({ default: false })
  // @IsBoolean()
  // coaching: boolean;

  // @Field(() => Boolean)
  // @Column({ default: false })
  // @IsBoolean()
  // physiotherapy: boolean;

  // @Field(() => Boolean)
  // @Column({ default: false })
  // @IsBoolean()
  // massage: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
