import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterOrderGroupItem1740475898588 implements MigrationInterface {
    name = 'AlterOrderGroupItem1740475898588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_group_items" ADD "is_confirm_by_driver" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_group_items" DROP COLUMN "is_confirm_by_driver"`);
    }

}
