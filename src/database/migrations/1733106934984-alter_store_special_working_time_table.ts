import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreSpecialWorkingTimeTable1733106934984 implements MigrationInterface {
    name = 'AlterStoreSpecialWorkingTimeTable1733106934984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_categories" RENAME COLUMN "storeId" TO "is_global"`);
        await queryRunner.query(`ALTER TABLE "store_special_working_time" ADD "is_open" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP COLUMN "is_global"`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD "is_global" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_categories" DROP COLUMN "is_global"`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD "is_global" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_special_working_time" DROP COLUMN "is_open"`);
        await queryRunner.query(`ALTER TABLE "product_categories" RENAME COLUMN "is_global" TO "storeId"`);
    }

}
