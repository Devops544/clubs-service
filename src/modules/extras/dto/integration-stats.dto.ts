import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class IntegrationStats {
  @Field(() => Int, { description: 'Number of clubs with hour bank enabled' })
  hourBankEnabled: number;

  @Field(() => Int, { description: 'Number of clubs with wishlist enabled' })
  wishlistEnabled: number;

  @Field(() => Int, { description: 'Number of clubs with external booking system' })
  externalBookingCount: number;

  @Field(() => Int, { description: 'Number of clubs with payment gateway' })
  paymentGatewayCount: number;

  @Field(() => Int, { description: 'Number of clubs with email marketing' })
  emailMarketingCount: number;

  @Field(() => Int, { description: 'Number of clubs with analytics integration' })
  analyticsCount: number;

  @Field(() => Int, { description: 'Number of clubs with social media integration' })
  socialMediaCount: number;
}
