import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoresTable1732638167045 implements MigrationInterface {
    name = 'AlterStoresTable1732638167045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD "is_alcohol" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "is_alcohol"`);
    }

}
