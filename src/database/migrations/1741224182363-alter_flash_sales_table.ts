import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterFlashSalesTable1741224182363 implements MigrationInterface {
    name = 'AlterFlashSalesTable1741224182363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flash_sales" ADD "status" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flash_sales" DROP COLUMN "status"`);
    }

}
