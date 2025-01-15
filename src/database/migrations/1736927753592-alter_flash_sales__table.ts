import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterFlashSales_table1736927753592 implements MigrationInterface {
    name = 'AlterFlashSales_table1736927753592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flash_sale_products" ALTER COLUMN "sold_quantity" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flash_sale_products" ALTER COLUMN "sold_quantity" DROP DEFAULT`);
    }

}
