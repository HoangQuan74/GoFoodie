import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterVouchersTable1736153206766 implements MigrationInterface {
    name = 'AlterVouchersTable1736153206766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vouchers" ADD "is_all_products" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vouchers" DROP COLUMN "is_all_products"`);
    }

}
