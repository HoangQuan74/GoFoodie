import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterOrderTable1739418701797 implements MigrationInterface {
    name = 'AlterOrderTable1739418701797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "parking_fee" numeric(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "peak_hour_fee" numeric(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "transaction_fee" numeric(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "app_fee" numeric(10,0) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "app_fee"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "transaction_fee"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "peak_hour_fee"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "parking_fee"`);
    }

}
