import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1761657149726 implements MigrationInterface {
  name = 'Migration1761657149726';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pricing" DROP COLUMN "startAt"`);
    await queryRunner.query(`ALTER TABLE "pricing" DROP COLUMN "endAt"`);
    await queryRunner.query(
      `ALTER TABLE "pricing" ADD "period" character varying(20) NOT NULL DEFAULT 'single'`,
    );
    await queryRunner.query(`ALTER TABLE "pricing" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."pricing_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "pricing" ADD "type" character varying(20) NOT NULL DEFAULT 'single'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pricing" DROP COLUMN "type"`);
    await queryRunner.query(
      `CREATE TYPE "public"."pricing_type_enum" AS ENUM('single', 'recurring')`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing" ADD "type" "public"."pricing_type_enum" NOT NULL DEFAULT 'single'`,
    );
    await queryRunner.query(`ALTER TABLE "pricing" DROP COLUMN "period"`);
    await queryRunner.query(`ALTER TABLE "pricing" ADD "endAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "pricing" ADD "startAt" TIMESTAMP WITH TIME ZONE`);
  }
}
