import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateAmenityInput {
  @Field({ description: 'UUID of the club this amenity belongs to' })
  @IsString()
  @IsUUID()
  clubId: string;

  @Field(() => Boolean, { defaultValue: false, description: 'Restaurant available' })
  @IsBoolean()
  @IsOptional()
  restaurant?: boolean;

  @Field(() => Boolean, { defaultValue: false, description: 'Hotel accommodation available' })
  @IsBoolean()
  @IsOptional()
  hotel?: boolean;

  @Field(() => Boolean, { defaultValue: false, description: 'Drinks service available' })
  @IsBoolean()
  @IsOptional()
  drinks?: boolean;

  @Field(() => Boolean, { defaultValue: false, description: 'Food service available' })
  @IsBoolean()
  @IsOptional()
  food?: boolean;

  @Field(() => Boolean, { defaultValue: false, description: 'Hot shower facilities available' })
  @IsBoolean()
  @IsOptional()
  hotShower?: boolean;

  @Field(() => Boolean, { defaultValue: false, description: 'Kids room available' })
  @IsBoolean()
  @IsOptional()
  kidsRoom?: boolean;

  @Field(() => Boolean, { defaultValue: false, description: 'WiFi internet access available' })
  @IsBoolean()
  @IsOptional()
  wifi?: boolean;

  @Field(() => Boolean, { defaultValue: false, description: 'Bar service available' })
  @IsBoolean()
  @IsOptional()
  bar?: boolean;

  @Field(() => Boolean, { defaultValue: false, description: 'Changing room facilities available' })
  @IsBoolean()
  @IsOptional()
  changingRoom?: boolean;
}
