import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreTable1738594820759 implements MigrationInterface {
    name = 'AlterStoreTable1738594820759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD "preparation_time" integer NOT NULL DEFAULT '20'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "total_quantity" bigint`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "promo_price" numeric(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "estimated_pickup_time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "estimated_delivery_time" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "estimated_delivery_time"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "estimated_pickup_time"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "promo_price"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total_quantity"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "preparation_time"`);
    }

}
