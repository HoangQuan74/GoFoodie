import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMerchantRefreshTokensTable1733901828125 implements MigrationInterface {
    name = 'CreateMerchantRefreshTokensTable1733901828125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchants" DROP CONSTRAINT "FK_852d9f0a02aeb0be90177155285"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_882687fd3a8a29fa5bf13858a5b"`);
        await queryRunner.query(`CREATE TYPE "public"."merchant_otps_type_enum" AS ENUM('forgot_password', 'verify_email')`);
        await queryRunner.query(`CREATE TABLE "merchant_otps" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "merchant_id" integer NOT NULL, "otp" character varying NOT NULL, "type" "public"."merchant_otps_type_enum" NOT NULL, "is_used" boolean NOT NULL DEFAULT false, "expired_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_6f651b0a3d16081b6e014dbd440" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "merchants" ADD CONSTRAINT "FK_852d9f0a02aeb0be90177155285" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_882687fd3a8a29fa5bf13858a5b" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_882687fd3a8a29fa5bf13858a5b"`);
        await queryRunner.query(`ALTER TABLE "merchants" DROP CONSTRAINT "FK_852d9f0a02aeb0be90177155285"`);
        await queryRunner.query(`DROP TABLE "merchant_otps"`);
        await queryRunner.query(`DROP TYPE "public"."merchant_otps_type_enum"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_882687fd3a8a29fa5bf13858a5b" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "merchants" ADD CONSTRAINT "FK_852d9f0a02aeb0be90177155285" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
