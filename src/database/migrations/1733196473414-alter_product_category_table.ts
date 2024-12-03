import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterProductCategoryTable1733196473414 implements MigrationInterface {
    name = 'AlterProductCategoryTable1733196473414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "product_categories_code_seq" OWNED BY "product_categories"."code"`);
        await queryRunner.query(`ALTER TABLE "product_categories" ALTER COLUMN "code" SET DEFAULT nextval('"product_categories_code_seq"')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_categories" ALTER COLUMN "code" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "product_categories_code_seq"`);
    }

}
