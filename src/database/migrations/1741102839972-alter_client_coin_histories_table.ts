import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterClientCoinHistoriesTable1741102839972 implements MigrationInterface {
    name = 'AlterClientCoinHistoriesTable1741102839972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_coin_histories" ADD "is_recovered" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_coin_histories" DROP COLUMN "is_recovered"`);
    }

}
