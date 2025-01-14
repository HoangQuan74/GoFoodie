import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterFlashSaleProductsTable1736830525793 implements MigrationInterface {
    name = 'AlterFlashSaleProductsTable1736830525793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vouchers" ADD "image_id" uuid`);
        await queryRunner.query(`CREATE TYPE "public"."flash_sale_products_discount_type_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`ALTER TABLE "flash_sale_products" ADD "discount_type" "public"."flash_sale_products_discount_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "flash_sale_products" ALTER COLUMN "price" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "flash_sale_products" ALTER COLUMN "discount" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD CONSTRAINT "FK_47f39de34f728915825d3a3d490" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vouchers" DROP CONSTRAINT "FK_47f39de34f728915825d3a3d490"`);
        await queryRunner.query(`ALTER TABLE "flash_sale_products" ALTER COLUMN "discount" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "flash_sale_products" ALTER COLUMN "price" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "flash_sale_products" DROP COLUMN "discount_type"`);
        await queryRunner.query(`DROP TYPE "public"."flash_sale_products_discount_type_enum"`);
        await queryRunner.query(`ALTER TABLE "vouchers" DROP COLUMN "image_id"`);
    }

}
