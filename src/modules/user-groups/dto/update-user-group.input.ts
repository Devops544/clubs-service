import { InputType, PartialType } from '@nestjs/graphql';
import { CreateUserGroupInput } from './create-user-group.input';

@InputType()
export class UpdateUserGroupInput extends PartialType(CreateUserGroupInput) {}
