import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreBanksTable1741619850803 implements MigrationInterface {
    name = 'AlterStoreBanksTable1741619850803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_banks" ADD "is_default" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_banks" DROP COLUMN "is_default"`);
    }

}
