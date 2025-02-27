import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterOrdersTable1740677036647 implements MigrationInterface {
    name = 'AlterOrdersTable1740677036647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "estimated_order_time" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "estimated_order_time" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "estimated_order_time" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "estimated_order_time" DROP NOT NULL`);
    }

}
