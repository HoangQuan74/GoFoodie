import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreCoinHistoryTable1741797306212 implements MigrationInterface {
    name = 'AlterStoreCoinHistoryTable1741797306212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_coin_histories" ADD "transaction_id" character varying`);
        await queryRunner.query(`ALTER TABLE "store_coin_histories" ADD "error_message" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_coin_histories" DROP COLUMN "error_message"`);
        await queryRunner.query(`ALTER TABLE "store_coin_histories" DROP COLUMN "transaction_id"`);
    }

}
