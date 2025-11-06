import { InputType, PartialType } from '@nestjs/graphql';
import { CreatePromoCodeInput } from './create-promocode.input';

@InputType()
export class UpdatePromoCodeInput extends PartialType(CreatePromoCodeInput) {}
