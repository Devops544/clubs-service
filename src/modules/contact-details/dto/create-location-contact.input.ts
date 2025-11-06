import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { UpdateLocationContactInput } from './update-location-contact.input';

@InputType()
export class CreateLocationContactInput extends UpdateLocationContactInput {
  @Field()
  @IsString()
  clubId: string;
}
