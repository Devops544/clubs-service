import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { UpdateWorkingHoursCalendarInput } from './update-working-hours-calendar.input';

@InputType()
export class CreateWorkingHoursCalendarInput extends UpdateWorkingHoursCalendarInput {
  @Field()
  @IsString()
  clubId: string;
}
