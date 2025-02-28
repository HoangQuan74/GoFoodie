import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterOrderTable1740737942556 implements MigrationInterface {
    name = 'AlterOrderTable1740737942556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "store_app_fee" numeric(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "store_delivery_fee" numeric(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "store_revenue" numeric(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "store_transaction_fee" numeric(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "client_total_paid" numeric(10,0) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "client_total_paid"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "store_transaction_fee"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "store_revenue"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "store_delivery_fee"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "store_app_fee"`);
    }

}
