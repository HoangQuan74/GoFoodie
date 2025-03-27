import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterOrdersTable1743066012230 implements MigrationInterface {
    name = 'AlterOrdersTable1743066012230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "coin_used" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "coin_returned" bigint NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "coin_returned"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "coin_used"`);
    }

}
