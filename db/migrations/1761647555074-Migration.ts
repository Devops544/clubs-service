import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1761647555074 implements MigrationInterface {
  name = 'Migration1761647555074';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "working_hours" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "clubId" uuid NOT NULL, "timezone" character varying, "availableDays" jsonb NOT NULL, "unavailableDays" jsonb, "calendarSettings" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_2e388c707a1888affa9dbabd5f" UNIQUE ("clubId"), CONSTRAINT "PK_5f84d2fa3953367fe9d704d8df6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "location_contact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "clubId" uuid NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "country" character varying NOT NULL, "description" text, "email" character varying, "phoneCountryCode" character varying, "phoneNumber" character varying, "websiteLink" character varying, "instagramLink" character varying, "tiktokLink" character varying, "facebookLink" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_40289485af2b6a246bf9369c17" UNIQUE ("clubId"), CONSTRAINT "PK_00b7796d758eea299db8dfcec7a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."resource_service_enum" AS ENUM('tennis', 'padel', 'squash', 'badminton', 'football', 'basketball', 'volleyball', 'fitness', 'gym', 'swimming', 'golf', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."resource_type_enum" AS ENUM('indoor', 'outdoor')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."resource_property_enum" AS ENUM('clay', 'hard', 'grass', 'carpet', 'concrete', 'wood', 'synthetic', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."resource_status_enum" AS ENUM('active', 'inactive', 'maintenance')`,
    );
    await queryRunner.query(
      `CREATE TABLE "resource" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "service" "public"."resource_service_enum" NOT NULL, "type" "public"."resource_type_enum" NOT NULL, "property" "public"."resource_property_enum" NOT NULL, "description" text, "enableOnlineBooking" boolean NOT NULL DEFAULT true, "color" character varying NOT NULL, "status" "public"."resource_status_enum" NOT NULL DEFAULT 'active', "clubId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "note" text, CONSTRAINT "PK_e2894a5867e06ae2e8889f1173f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "amenity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "clubId" uuid NOT NULL, "restaurant" boolean NOT NULL DEFAULT false, "hotel" boolean NOT NULL DEFAULT false, "drinks" boolean NOT NULL DEFAULT false, "food" boolean NOT NULL DEFAULT false, "hotShower" boolean NOT NULL DEFAULT false, "kidsRoom" boolean NOT NULL DEFAULT false, "wifi" boolean NOT NULL DEFAULT false, "bar" boolean NOT NULL DEFAULT false, "changingRoom" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_f2a36012ce5ab29dbdeeebf21b" UNIQUE ("clubId"), CONSTRAINT "PK_f981de7b1a822823e5f31da10dc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."coach_gender_enum" AS ENUM('male', 'female', 'other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "coach" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "surname" character varying NOT NULL, "email" character varying NOT NULL, "phoneCountryCode" character varying, "phone" character varying, "avatar" character varying, "gender" "public"."coach_gender_enum", "country" character varying, "city" character varying, "address" text, "languages" jsonb, "services" uuid array NOT NULL DEFAULT '{}', "education" text, "experienceCategories" jsonb, "workExperience" text, "onlineBookingEnabled" boolean NOT NULL DEFAULT false, "availability" jsonb, "resources" character varying, "holidaySchedule" jsonb, "clubId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c2ca0875fe0755b197d0147713d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."membership_status_enum" AS ENUM('active', 'inactive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "membership" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "services" uuid array NOT NULL DEFAULT '{}', "price" numeric(12,2), "currency" character varying(8), "numberOfBookingHours" integer, "resources" uuid array, "membershipsLimit" integer, "fixedDiscount" integer, "periodType" character varying(32), "startAt" TIMESTAMP WITH TIME ZONE, "endAt" TIMESTAMP WITH TIME ZONE, "status" "public"."membership_status_enum" NOT NULL DEFAULT 'active', "clubId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_83c1afebef3059472e7c37e8de8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."pricing_type_enum" AS ENUM('single', 'recurring')`,
    );
    await queryRunner.query(
      `CREATE TABLE "pricing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "weekdays" text array NOT NULL DEFAULT '{}', "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "resourceIds" uuid array, "price" numeric(12,2), "currency" character varying(8), "userGroupIds" uuid array, "membershipIds" uuid array, "type" "public"."pricing_type_enum" NOT NULL DEFAULT 'single', "startAt" TIMESTAMP WITH TIME ZONE, "endAt" TIMESTAMP WITH TIME ZONE, "clubId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4f6e9c88033106a989aa7ce9dee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."promocode_promocode_type_enum" AS ENUM('discount_percent', 'discount_amount')`,
    );
    await queryRunner.query(
      `CREATE TABLE "promocode" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "serviceIds" text array NOT NULL DEFAULT '{}', "resourceIds" uuid array, "userGroupIds" uuid array, "membershipIds" uuid array, "startAt" TIMESTAMP WITH TIME ZONE, "endAt" TIMESTAMP WITH TIME ZONE, "promocode_type" "public"."promocode_promocode_type_enum" NOT NULL, "amount_in_percent" numeric(12,2) NOT NULL, "limitPerCustomer" jsonb, "totalUsageLimit" jsonb, "clubId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_181c2c413dea9b3c725820e4dde" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_group_status_enum" AS ENUM('active', 'inactive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "color" character varying NOT NULL, "services" uuid array NOT NULL DEFAULT '{}', "fixedDiscount" integer, "maxCustomers" integer, "status" "public"."user_group_status_enum" NOT NULL DEFAULT 'active', "clubId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3c29fba6fe013ec8724378ce7c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."club_sports_enum" AS ENUM('tennis', 'padel', 'squash', 'badminton', 'football', 'basketball', 'volleyball', 'fitness', 'gym', 'swimming', 'golf', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."club_additionalservices_enum" AS ENUM('restaurant', 'hotel', 'drinks', 'food', 'hot_shower', 'kids_room', 'wifi', 'bar', 'changing_room', 'parking', 'locker_room', 'pro_shop', 'coaching', 'physiotherapy', 'massage', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."club_setupstatus_enum" AS ENUM('draft', 'in_progress', 'completed', 'abandoned')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."club_currentstep_enum" AS ENUM('club_setup', 'location_contact', 'working_hours', 'resources', 'amenities', 'memberships', 'pricing', 'user_groups', 'extras_integrations', 'coaches', 'team_members')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."club_completedsteps_enum" AS ENUM('club_setup', 'location_contact', 'working_hours', 'resources', 'amenities', 'memberships', 'pricing', 'user_groups', 'extras_integrations', 'coaches', 'team_members')`,
    );
    await queryRunner.query(
      `CREATE TABLE "club" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "typeOfClub" character varying, "sports" "public"."club_sports_enum" array, "additionalServices" "public"."club_additionalservices_enum" array, "isPartOfChain" boolean DEFAULT false, "chainId" character varying, "logo" character varying, "galleryImages" text array, "enableOnlineBookings" boolean NOT NULL DEFAULT false, "enableClassBookings" boolean NOT NULL DEFAULT false, "enableOpenMatches" boolean NOT NULL DEFAULT false, "enableAcademyManagement" boolean NOT NULL DEFAULT false, "enableEventManagement" boolean NOT NULL DEFAULT false, "enableLeagueTournamentManagement" boolean NOT NULL DEFAULT false, "currency" character varying, "onlinePayment" boolean NOT NULL DEFAULT false, "onsitePayment" boolean NOT NULL DEFAULT false, "byInvoice" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "setupStatus" "public"."club_setupstatus_enum" DEFAULT 'draft', "currentStep" "public"."club_currentstep_enum", "completedSteps" "public"."club_completedsteps_enum" array, "lastSavedAt" TIMESTAMP, CONSTRAINT "PK_79282481e036a6e0b180afa38aa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."team_member_gender_enum" AS ENUM('male', 'female', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."team_member_status_enum" AS ENUM('active', 'inactive', 'suspended')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."team_member_club_owner_enum" AS ENUM('owner', 'co_owner', 'manager', 'admin', 'member')`,
    );
    await queryRunner.query(
      `CREATE TABLE "team_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "surname" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "countryCode" character varying, "country" character varying, "gender" "public"."team_member_gender_enum", "dateOfBirth" date, "position" character varying, "bio" text, "avatar" character varying, "status" "public"."team_member_status_enum" NOT NULL DEFAULT 'active', "permissions" text array NOT NULL DEFAULT '{}', "club_owner" "public"."team_member_club_owner_enum", "notes" text, "clubId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_649680684d72a20d279641469c5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."extras_status_enum" AS ENUM('active', 'inactive', 'suspended')`,
    );
    await queryRunner.query(
      `CREATE TABLE "extras" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "clubId" uuid NOT NULL, "hourBank" boolean NOT NULL DEFAULT false, "hourBankLimits" jsonb NOT NULL DEFAULT '[]', "wishlist" boolean NOT NULL DEFAULT false, "wishlistDescription" text, "wishlistLimits" jsonb NOT NULL DEFAULT '[]', "externalBookingSystem" text, "paymentGateway" text, "emailMarketing" text, "analyticsIntegration" text, "socialMediaIntegration" text, "loyaltyProgram" jsonb, "notificationSettings" jsonb, "apiKeys" jsonb, "status" "public"."extras_status_enum" NOT NULL DEFAULT 'active', "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e07ed57e910c6cfc15f350141a2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."coach_classes_pricetype_enum" AS ENUM('per_class', 'per_client')`,
    );
    await queryRunner.query(
      `CREATE TABLE "coach_classes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "service" uuid array NOT NULL DEFAULT '{}', "group" uuid array NOT NULL DEFAULT '{}', "resource" uuid array NOT NULL DEFAULT '{}', "priceType" "public"."coach_classes_pricetype_enum" NOT NULL, "price" numeric(10,2) NOT NULL, "coach" jsonb NOT NULL DEFAULT '[]', "clubId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_493204f795bb25ac0830c373d1a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "working_hours" ADD CONSTRAINT "FK_2e388c707a1888affa9dbabd5ff" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "location_contact" ADD CONSTRAINT "FK_40289485af2b6a246bf9369c177" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "resource" ADD CONSTRAINT "FK_76cf5bd5797dad0ec53b7591336" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "amenity" ADD CONSTRAINT "FK_f2a36012ce5ab29dbdeeebf21b8" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "coach" ADD CONSTRAINT "FK_71ccc9d8463baaf332513b60475" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "membership" ADD CONSTRAINT "FK_ef23be796d14af117f3e737e707" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing" ADD CONSTRAINT "FK_e1e000404968149ee652ed9d800" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "promocode" ADD CONSTRAINT "FK_1d6222b2a14c5eb10b4d8c294ef" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_group" ADD CONSTRAINT "FK_10b01df598b30fb3fb6b0a50c7e" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD CONSTRAINT "FK_6cfb4535f990b44921049caec33" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "extras" ADD CONSTRAINT "FK_f3175003d63dfe3273e3766872d" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "coach_classes" ADD CONSTRAINT "FK_844af199bc2a40e892d2c318406" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coach_classes" DROP CONSTRAINT "FK_844af199bc2a40e892d2c318406"`,
    );
    await queryRunner.query(
      `ALTER TABLE "extras" DROP CONSTRAINT "FK_f3175003d63dfe3273e3766872d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP CONSTRAINT "FK_6cfb4535f990b44921049caec33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_group" DROP CONSTRAINT "FK_10b01df598b30fb3fb6b0a50c7e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "promocode" DROP CONSTRAINT "FK_1d6222b2a14c5eb10b4d8c294ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing" DROP CONSTRAINT "FK_e1e000404968149ee652ed9d800"`,
    );
    await queryRunner.query(
      `ALTER TABLE "membership" DROP CONSTRAINT "FK_ef23be796d14af117f3e737e707"`,
    );
    await queryRunner.query(`ALTER TABLE "coach" DROP CONSTRAINT "FK_71ccc9d8463baaf332513b60475"`);
    await queryRunner.query(
      `ALTER TABLE "amenity" DROP CONSTRAINT "FK_f2a36012ce5ab29dbdeeebf21b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "resource" DROP CONSTRAINT "FK_76cf5bd5797dad0ec53b7591336"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location_contact" DROP CONSTRAINT "FK_40289485af2b6a246bf9369c177"`,
    );
    await queryRunner.query(
      `ALTER TABLE "working_hours" DROP CONSTRAINT "FK_2e388c707a1888affa9dbabd5ff"`,
    );
    await queryRunner.query(`DROP TABLE "coach_classes"`);
    await queryRunner.query(`DROP TYPE "public"."coach_classes_pricetype_enum"`);
    await queryRunner.query(`DROP TABLE "extras"`);
    await queryRunner.query(`DROP TYPE "public"."extras_status_enum"`);
    await queryRunner.query(`DROP TABLE "team_member"`);
    await queryRunner.query(`DROP TYPE "public"."team_member_club_owner_enum"`);
    await queryRunner.query(`DROP TYPE "public"."team_member_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."team_member_gender_enum"`);
    await queryRunner.query(`DROP TABLE "club"`);
    await queryRunner.query(`DROP TYPE "public"."club_completedsteps_enum"`);
    await queryRunner.query(`DROP TYPE "public"."club_currentstep_enum"`);
    await queryRunner.query(`DROP TYPE "public"."club_setupstatus_enum"`);
    await queryRunner.query(`DROP TYPE "public"."club_additionalservices_enum"`);
    await queryRunner.query(`DROP TYPE "public"."club_sports_enum"`);
    await queryRunner.query(`DROP TABLE "user_group"`);
    await queryRunner.query(`DROP TYPE "public"."user_group_status_enum"`);
    await queryRunner.query(`DROP TABLE "promocode"`);
    await queryRunner.query(`DROP TYPE "public"."promocode_promocode_type_enum"`);
    await queryRunner.query(`DROP TABLE "pricing"`);
    await queryRunner.query(`DROP TYPE "public"."pricing_type_enum"`);
    await queryRunner.query(`DROP TABLE "membership"`);
    await queryRunner.query(`DROP TYPE "public"."membership_status_enum"`);
    await queryRunner.query(`DROP TABLE "coach"`);
    await queryRunner.query(`DROP TYPE "public"."coach_gender_enum"`);
    await queryRunner.query(`DROP TABLE "amenity"`);
    await queryRunner.query(`DROP TABLE "resource"`);
    await queryRunner.query(`DROP TYPE "public"."resource_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."resource_property_enum"`);
    await queryRunner.query(`DROP TYPE "public"."resource_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."resource_service_enum"`);
    await queryRunner.query(`DROP TABLE "location_contact"`);
    await queryRunner.query(`DROP TABLE "working_hours"`);
  }
}
