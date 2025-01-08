import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWorkingSessionsTable1736320853493 implements MigrationInterface {
    name = 'CreateWorkingSessionsTable1736320853493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "driver_working_sessions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "driver_id" integer NOT NULL, "start_time" TIMESTAMP NOT NULL DEFAULT now(), "end_time" TIMESTAMP, CONSTRAINT "PK_1c6302736160f7bba529e023ca7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."merchant_otps_type_enum" RENAME TO "merchant_otps_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."merchant_otps_type_enum" AS ENUM('forgot_password', 'verify_email', 'update_phone')`);
        await queryRunner.query(`ALTER TABLE "merchant_otps" ALTER COLUMN "type" TYPE "public"."merchant_otps_type_enum" USING "type"::"text"::"public"."merchant_otps_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."merchant_otps_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."admin_otps_type_enum" RENAME TO "admin_otps_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."admin_otps_type_enum" AS ENUM('forgot_password', 'verify_email', 'update_phone')`);
        await queryRunner.query(`ALTER TABLE "admin_otps" ALTER COLUMN "type" TYPE "public"."admin_otps_type_enum" USING "type"::"text"::"public"."admin_otps_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."admin_otps_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "driver_working_sessions" ADD CONSTRAINT "FK_b19c82d59bb171a687bf6fb4196" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_working_sessions" DROP CONSTRAINT "FK_b19c82d59bb171a687bf6fb4196"`);
        await queryRunner.query(`CREATE TYPE "public"."admin_otps_type_enum_old" AS ENUM('forgot_password', 'verify_email')`);
        await queryRunner.query(`ALTER TABLE "admin_otps" ALTER COLUMN "type" TYPE "public"."admin_otps_type_enum_old" USING "type"::"text"::"public"."admin_otps_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."admin_otps_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."admin_otps_type_enum_old" RENAME TO "admin_otps_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."merchant_otps_type_enum_old" AS ENUM('forgot_password', 'verify_email')`);
        await queryRunner.query(`ALTER TABLE "merchant_otps" ALTER COLUMN "type" TYPE "public"."merchant_otps_type_enum_old" USING "type"::"text"::"public"."merchant_otps_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."merchant_otps_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."merchant_otps_type_enum_old" RENAME TO "merchant_otps_type_enum"`);
        await queryRunner.query(`DROP TABLE "driver_working_sessions"`);
    }

}
