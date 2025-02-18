import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoresTable1739853631904 implements MigrationInterface {
    name = 'AlterStoresTable1739853631904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD "is_self_delivery" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "is_self_delivery"`);
    }

}
