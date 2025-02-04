import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterOrderTable1738652222877 implements MigrationInterface {
    name = 'AlterOrderTable1738652222877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orders_order_type_enum" AS ENUM('PRE', 'NOW')`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "order_type" "public"."orders_order_type_enum" NOT NULL DEFAULT 'NOW'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "estimated_order_time" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "estimated_order_time"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "order_type"`);
        await queryRunner.query(`DROP TYPE "public"."orders_order_type_enum"`);
    }

}
