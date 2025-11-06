import { InputType, PartialType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateCoachInput } from './create-coach.input';

@InputType()
export class UpdateCoachInput extends PartialType(CreateCoachInput) {
  @Field(() => String)
  @IsUUID('4')
  id: string;
}
