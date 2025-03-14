import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterFlashSalesTable1741928892005 implements MigrationInterface {
    name = 'AlterFlashSalesTable1741928892005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flash_sales" ADD "product_quantity" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "flash_sales"."product_quantity" IS 'Số lượng sản phẩm'`);
        await queryRunner.query(`ALTER TABLE "flash_sales" ADD "limit_quantity" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "flash_sales"."limit_quantity" IS 'Số lượng sản phẩm tối đa mỗi khách hàng được mua'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "flash_sales"."limit_quantity" IS 'Số lượng sản phẩm tối đa mỗi khách hàng được mua'`);
        await queryRunner.query(`ALTER TABLE "flash_sales" DROP COLUMN "limit_quantity"`);
        await queryRunner.query(`COMMENT ON COLUMN "flash_sales"."product_quantity" IS 'Số lượng sản phẩm'`);
        await queryRunner.query(`ALTER TABLE "flash_sales" DROP COLUMN "product_quantity"`);
    }

}
