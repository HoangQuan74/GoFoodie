import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterProductCategoriesTable1736486658882 implements MigrationInterface {
    name = 'AlterProductCategoriesTable1736486658882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_categories" ADD "parent_id" integer`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_5f151d414daab0290f65b517ed4" FOREIGN KEY ("parent_id") REFERENCES "product_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_5f151d414daab0290f65b517ed4"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP COLUMN "parent_id"`);
    }

}
