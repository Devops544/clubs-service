import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1761658764026 implements MigrationInterface {
  name = 'Migration1761658764026';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "promocode" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "promocode" DROP COLUMN "startAt"`);
    await queryRunner.query(`ALTER TABLE "promocode" DROP COLUMN "endAt"`);
    await queryRunner.query(`ALTER TABLE "promocode" DROP COLUMN "promocode_type"`);
    await queryRunner.query(`DROP TYPE "public"."promocode_promocode_type_enum"`);
    await queryRunner.query(`ALTER TABLE "promocode" DROP COLUMN "amount_in_percent"`);
    await queryRunner.query(`ALTER TABLE "promocode" DROP COLUMN "limitPerCustomer"`);
    await queryRunner.query(`ALTER TABLE "promocode" DROP COLUMN "totalUsageLimit"`);
    await queryRunner.query(`ALTER TABLE "promocode" ADD "name" text`);
    await queryRunner.query(`ALTER TABLE "promocode" ADD "promo_period" text`);
    await queryRunner.query(`ALTER TABLE "promocode" ADD "custom_period_number" integer`);
    await queryRunner.query(`ALTER TABLE "promocode" ADD "custom_period_string" text`);
    await queryRunner.query(`ALTER TABLE "promocode" ADD "price_type" text`);
    await queryRunner.query(`ALTER TABLE "promocode" ADD "amount" numeric(12,2)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "promocode" DROP COLUMN "amount"`);
    await queryRunner.query(`ALTER TABLE "promocode" DROP COLUMN "price_type"`);
    await queryRunner.query(`ALTER TABLE "promocode" DROP COLUMN "custom_period_string"`);
    await queryRunner.query(`ALTER TABLE "promocode" DROP COLUMN "custom_period_number"`);
    await queryRunner.query(`ALTER TABLE "promocode" DROP COLUMN "promo_period"`);
    await queryRunner.query(`ALTER TABLE "promocode" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "promocode" ADD "totalUsageLimit" jsonb`);
    await queryRunner.query(`ALTER TABLE "promocode" ADD "limitPerCustomer" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "promocode" ADD "amount_in_percent" numeric(12,2) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."promocode_promocode_type_enum" AS ENUM('discount_percent', 'discount_amount')`,
    );
    await queryRunner.query(
      `ALTER TABLE "promocode" ADD "promocode_type" "public"."promocode_promocode_type_enum" NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "promocode" ADD "endAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "promocode" ADD "startAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "promocode" ADD "title" character varying NOT NULL`);
  }
}
