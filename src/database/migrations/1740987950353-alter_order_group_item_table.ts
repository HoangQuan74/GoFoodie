import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterOrderGroupItemTable1740987950353 implements MigrationInterface {
    name = 'AlterOrderGroupItemTable1740987950353'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_group_items" ADD "route_priority" jsonb NOT NULL DEFAULT '{"store":0,"client":1}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_group_items" DROP COLUMN "route_priority"`);
    }

}
