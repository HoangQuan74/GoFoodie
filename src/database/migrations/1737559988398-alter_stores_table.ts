import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoresTable1737559988398 implements MigrationInterface {
    name = 'AlterStoresTable1737559988398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "latitude" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "longitude" TYPE double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "longitude" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "latitude" TYPE integer`);
    }

}
