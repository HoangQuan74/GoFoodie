import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterOrderTable1737620279913 implements MigrationInterface {
    name = 'AlterOrderTable1737620279913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "eating_tools" boolean DEFAULT true NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "delivery_fee" numeric(10,2) DEFAULT '0'  NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "delivery_fee" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "delivery_fee" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "eating_tools" DROP NOT NULL`);
    }

}
