import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1732069270200 implements MigrationInterface {
  name = 'Init1732069270200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."admins_status_enum" AS ENUM('active', 'inactive')`);
    await queryRunner.query(
      `CREATE TABLE "admins" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "last_login" TIMESTAMP, "email_verified_at" TIMESTAMP, "status" "public"."admins_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."admin_otps_type_enum" AS ENUM('forgot_password', 'verify_email')`);
    await queryRunner.query(
      `CREATE TABLE "admin_otps" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "admin_id" integer NOT NULL, "otp" character varying NOT NULL, "type" "public"."admin_otps_type_enum" NOT NULL, "is_used" boolean NOT NULL DEFAULT false, "expired_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_c652e103032409ac08bf4d8a40e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "admin_otps"`);
    await queryRunner.query(`DROP TYPE "public"."admin_otps_type_enum"`);
    await queryRunner.query(`DROP TABLE "admins"`);
    await queryRunner.query(`DROP TYPE "public"."admins_status_enum"`);
  }
}
