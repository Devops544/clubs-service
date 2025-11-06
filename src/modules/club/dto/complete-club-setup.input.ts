import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEnum } from 'class-validator';
import { SetupStep } from '../entities/club.entity';

@InputType()
export class CompleteClubSetupInput {
  @Field()
  @IsString()
  clubId: string;

  @Field(() => String)
  @IsEnum(SetupStep)
  finalStep: SetupStep;
}
