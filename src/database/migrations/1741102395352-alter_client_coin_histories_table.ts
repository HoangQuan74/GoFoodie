import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterClientCoinHistoriesTable1741102395352 implements MigrationInterface {
    name = 'AlterClientCoinHistoriesTable1741102395352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_coin_histories" ADD "used" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_coin_histories" DROP COLUMN "used"`);
    }

}
