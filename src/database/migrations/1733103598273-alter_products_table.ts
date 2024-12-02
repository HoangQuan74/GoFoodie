import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterProductsTable1733103598273 implements MigrationInterface {
    name = 'AlterProductsTable1733103598273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_455bbffe981d850da829cb522f6"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_6156a79599e274ee9d83b1de139"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_782da5e50e94b763eb63225d69d"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_5210b3add61b23c9c2d1bbc187d"`);
        await queryRunner.query(`ALTER TABLE "product_categories" RENAME COLUMN "productId" TO "store_id"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "productCategoryId"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "storeId"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."products_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`ALTER TABLE "products" ADD "status" "public"."products_status_enum" NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_da182a942b24bbac5701ae2ef26" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_cd2b4197eb0f551ed0272cee6de" FOREIGN KEY ("product_category_id") REFERENCES "product_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_68863607048a1abd43772b314ef" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_68863607048a1abd43772b314ef"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_cd2b4197eb0f551ed0272cee6de"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_da182a942b24bbac5701ae2ef26"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."products_status_enum"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD "storeId" integer`);
        await queryRunner.query(`ALTER TABLE "products" ADD "productCategoryId" integer`);
        await queryRunner.query(`ALTER TABLE "product_categories" RENAME COLUMN "store_id" TO "productId"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_5210b3add61b23c9c2d1bbc187d" FOREIGN KEY ("productCategoryId") REFERENCES "product_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_782da5e50e94b763eb63225d69d" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_6156a79599e274ee9d83b1de139" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_455bbffe981d850da829cb522f6" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
