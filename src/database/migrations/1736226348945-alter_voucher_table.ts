import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterVoucherTable1736226348945 implements MigrationInterface {
    name = 'AlterVoucherTable1736226348945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."vouchers_max_discount_type_enum" AS ENUM('limited', 'unlimited')`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD "max_discount_type" "public"."vouchers_max_discount_type_enum" NOT NULL DEFAULT 'unlimited'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vouchers" DROP COLUMN "max_discount_type"`);
        await queryRunner.query(`DROP TYPE "public"."vouchers_max_discount_type_enum"`);
    }

}
