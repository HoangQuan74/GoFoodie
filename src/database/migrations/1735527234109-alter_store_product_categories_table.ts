import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreProductCategoriesTable1735527234109 implements MigrationInterface {
    name = 'AlterStoreProductCategoriesTable1735527234109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "store_product_categories" ("product_category_id" integer NOT NULL, "store_id" integer NOT NULL, CONSTRAINT "PK_a4f710484fbbe449e69de1a00f6" PRIMARY KEY ("product_category_id", "store_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_90c29329b51ebfe396c62329a7" ON "store_product_categories" ("product_category_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2d40463303e04fc3fd3bb23daa" ON "store_product_categories" ("store_id") `);
        await queryRunner.query(`ALTER TABLE "store_product_categories" ADD CONSTRAINT "FK_90c29329b51ebfe396c62329a72" FOREIGN KEY ("product_category_id") REFERENCES "product_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "store_product_categories" ADD CONSTRAINT "FK_2d40463303e04fc3fd3bb23daad" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_product_categories" DROP CONSTRAINT "FK_2d40463303e04fc3fd3bb23daad"`);
        await queryRunner.query(`ALTER TABLE "store_product_categories" DROP CONSTRAINT "FK_90c29329b51ebfe396c62329a72"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2d40463303e04fc3fd3bb23daa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_90c29329b51ebfe396c62329a7"`);
        await queryRunner.query(`DROP TABLE "store_product_categories"`);
    }

}
