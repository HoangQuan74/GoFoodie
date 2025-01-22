import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterOrdersTable1737536490223 implements MigrationInterface {
    name = 'AlterOrdersTable1737536490223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "tip" bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "tip"`);
    }

}
