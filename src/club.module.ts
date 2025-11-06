import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { LocationContactModule } from './modules/contact-details/location-contact.module';
import { WorkingHoursCalendarModule } from './modules/working-hours/working-hours-calendar.module';
import { ClubSetupModule } from './modules/club/club.module';
import { ResourceModule } from './modules/resources/resource.module';
import { AmenityModule } from './modules/resources/amenity.module';
import { UserGroupModule } from './modules/user-groups/user-group.module';
import { MembershipModule } from './modules/memberships/membership.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { CoachesModule } from './modules/coaches/coaches.module';
import { TeamMembersModule } from './modules/team-members/team-members.module';
import { ExtrasModule } from './modules/extras/extras.module';
import { HealthController } from './health.controller';
import { ConfigModule } from '@nestjs/config';
// import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'clubs',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'clubs',
      ssl:
        process.env.SSL_REQUIRED && process.env.SSL_REQUIRED === 'false'
          ? false
          : {
              rejectUnauthorized: false,
            },
      schema: 'public',
      entities: [
        join(__dirname, 'modules/club/entities', '*.entity.{ts,js}'),
        join(__dirname, 'modules/contact-details/entities', '*.entity.{ts,js}'),
        join(__dirname, 'modules/working-hours/entities', '*.entity.{ts,js}'),
        join(__dirname, 'modules/resources/entities', '*.entity.{ts,js}'),
        join(__dirname, 'modules/user-groups/entities', '*.entity.{ts,js}'),
        join(__dirname, 'modules/memberships/entities', '*.entity.{ts,js}'),
        join(__dirname, 'modules/pricing/entities', '*.entity.{ts,js}'),
        join(__dirname, 'modules/coaches/entities', '*.entity.{ts,js}'),
        join(__dirname, 'modules/team-members/entities', '*.entity.{ts,js}'),
        join(__dirname, 'modules/extras/entities', '*.entity.{ts,js}'),
      ],
      synchronize: false,
      logging: true,
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: {
        path: join(process.cwd(), 'schema.gql'),
        federation: 2,
      },
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      introspection: true, // Must be true for federation
      // Enable context to access request headers from gateway
      context: ({ req }) => ({ req }),
    }),

    ClubSetupModule,
    LocationContactModule,
    WorkingHoursCalendarModule,
    ResourceModule,
    AmenityModule,
    UserGroupModule,
    MembershipModule,
    PricingModule,
    ExtrasModule,
    CoachesModule,
    TeamMembersModule,
  ],
  controllers: [HealthController],
})
export class ClubModule {}
