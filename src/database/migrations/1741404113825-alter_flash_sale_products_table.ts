import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterFlashSaleProductsTable1741404113825 implements MigrationInterface {
    name = 'AlterFlashSaleProductsTable1741404113825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flash_sale_products" ALTER COLUMN "product_quantity" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "flash_sale_products" ALTER COLUMN "limit_quantity" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flash_sale_products" ALTER COLUMN "limit_quantity" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "flash_sale_products" ALTER COLUMN "product_quantity" SET NOT NULL`);
    }

}
