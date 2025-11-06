import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateAmenityInput } from './create-amenity.input';

@InputType()
export class UpdateAmenityInput extends PartialType(CreateAmenityInput) {}
