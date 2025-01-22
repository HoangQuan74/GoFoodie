import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoresTable1737534238876 implements MigrationInterface {
    name = 'AlterStoresTable1737534238876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD "latitude" integer`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "longitude" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "latitude"`);
    }

}
