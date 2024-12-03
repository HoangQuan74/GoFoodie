import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterProductCategoryTable1733196038504 implements MigrationInterface {
    name = 'AlterProductCategoryTable1733196038504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_categories" ADD "code" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."product_categories_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD "status" "public"."product_categories_status_enum" NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_categories" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."product_categories_status_enum"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP COLUMN "code"`);
    }

}
