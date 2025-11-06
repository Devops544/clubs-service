import { InputType, PartialType } from '@nestjs/graphql';
import { CreateTeamMemberInput } from './create-team-member.input';

@InputType()
export class UpdateTeamMemberInput extends PartialType(CreateTeamMemberInput) {}
