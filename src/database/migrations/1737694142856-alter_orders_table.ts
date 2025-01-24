import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterOrdersTable1737694142856 implements MigrationInterface {
    name = 'AlterOrdersTable1737694142856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "order_code" character varying NOT NULL DEFAULT '###'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "order_code"`);
    }

}
