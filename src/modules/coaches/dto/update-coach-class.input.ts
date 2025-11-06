import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateCoachClassInput } from './create-coach-class.input';

@InputType()
export class UpdateCoachClassInput extends PartialType(CreateCoachClassInput) {
  @Field(() => String)
  id: string;
}
