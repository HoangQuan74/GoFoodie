import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreAddressesTable1736778970555 implements MigrationInterface {
    name = 'AlterStoreAddressesTable1736778970555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "flash_sale_products" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "flash_sale_id" integer NOT NULL, "product_id" integer NOT NULL, "price" double precision NOT NULL, "discount" double precision NOT NULL, "status" boolean NOT NULL, "product_quantity" integer NOT NULL, "sold_quantity" integer NOT NULL, "limit_quantity" integer NOT NULL, CONSTRAINT "PK_d87336248cdf6a0941552f621f7" PRIMARY KEY ("id")); COMMENT ON COLUMN "flash_sale_products"."product_quantity" IS 'Số lượng sản phẩm'; COMMENT ON COLUMN "flash_sale_products"."sold_quantity" IS 'Số lượng sản phẩm đã bán'; COMMENT ON COLUMN "flash_sale_products"."limit_quantity" IS 'Số lượng sản phẩm tối đa mỗi khách hàng được mua'`);
        await queryRunner.query(`ALTER TABLE "flash_sales" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_address" ALTER COLUMN "lat" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "store_address" ALTER COLUMN "lng" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "flash_sales" ALTER COLUMN "start_date" TYPE date`);
        await queryRunner.query(`ALTER TABLE "flash_sales" ALTER COLUMN "end_date" TYPE date`);
        await queryRunner.query(`ALTER TABLE "flash_sale_products" ADD CONSTRAINT "FK_feed21927beb816dc903d910ef5" FOREIGN KEY ("flash_sale_id") REFERENCES "flash_sales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flash_sale_products" ADD CONSTRAINT "FK_f049f078782ea89f22e2dcbf34f" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flash_sale_products" DROP CONSTRAINT "FK_f049f078782ea89f22e2dcbf34f"`);
        await queryRunner.query(`ALTER TABLE "flash_sale_products" DROP CONSTRAINT "FK_feed21927beb816dc903d910ef5"`);
        await queryRunner.query(`ALTER TABLE "flash_sales" ALTER COLUMN "end_date" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "flash_sales" ALTER COLUMN "start_date" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "store_address" ALTER COLUMN "lng" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "store_address" ALTER COLUMN "lat" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "flash_sales" DROP COLUMN "name"`);
        await queryRunner.query(`DROP TABLE "flash_sale_products"`);
    }

}
