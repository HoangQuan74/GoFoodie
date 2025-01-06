import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVouchersTable1736150540376 implements MigrationInterface {
    name = 'CreateVouchersTable1736150540376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "voucher_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_47e99714ff7105621d7104b7fad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."vouchers_refund_type_enum" AS ENUM('promotion', 'refund')`);
        await queryRunner.query(`CREATE TYPE "public"."vouchers_discount_type_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`CREATE TABLE "vouchers" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "code" character varying NOT NULL, "type_id" integer NOT NULL, "service_type_id" integer NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "refund_type" "public"."vouchers_refund_type_enum" NOT NULL, "is_can_save" boolean NOT NULL DEFAULT false, "discount_type" "public"."vouchers_discount_type_enum" NOT NULL, "discount_value" integer NOT NULL, "min_order_value" integer NOT NULL DEFAULT '0', "max_discount_value" integer, "is_private" boolean NOT NULL DEFAULT false, "max_use_time" integer NOT NULL, "max_use_time_per_user" integer NOT NULL, "created_by_id" integer NOT NULL, CONSTRAINT "PK_ed1b7dd909a696560763acdbc04" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD CONSTRAINT "FK_5f04d1ee1cb236c70b2c4535a08" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD CONSTRAINT "FK_15a3076888af32b92199483f809" FOREIGN KEY ("created_by_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD CONSTRAINT "FK_6486f6a0a7ebf9ecbf47cadcbad" FOREIGN KEY ("type_id") REFERENCES "voucher_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vouchers" DROP CONSTRAINT "FK_6486f6a0a7ebf9ecbf47cadcbad"`);
        await queryRunner.query(`ALTER TABLE "vouchers" DROP CONSTRAINT "FK_15a3076888af32b92199483f809"`);
        await queryRunner.query(`ALTER TABLE "vouchers" DROP CONSTRAINT "FK_5f04d1ee1cb236c70b2c4535a08"`);
        await queryRunner.query(`DROP TABLE "vouchers"`);
        await queryRunner.query(`DROP TYPE "public"."vouchers_discount_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."vouchers_refund_type_enum"`);
        await queryRunner.query(`DROP TABLE "voucher_types"`);
    }

}
