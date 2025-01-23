import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterOrderTable1737619341273 implements MigrationInterface {
    name = 'AlterOrderTable1737619341273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "eating_tools" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "delivery_fee" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "price" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "subtotal" TYPE numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_024a7c3ff6685158e55bae1fa9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0f374a0f6f90888a94110366af"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_65c973319eed381803ea5f0ecc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1371aab853281382c7d8a20192"`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "subtotal" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivery_fee"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "eating_tools"`);
    }

}
