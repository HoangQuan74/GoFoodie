import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoresTable1733837986126 implements MigrationInterface {
    name = 'AlterStoresTable1733837986126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD "parking_fee" integer`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD "business_name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP COLUMN "business_name"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "parking_fee"`);
    }

}
