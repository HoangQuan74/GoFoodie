import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreTransactionHistoriesTable1741165298942 implements MigrationInterface {
    name = 'AlterStoreTransactionHistoriesTable1741165298942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_transaction_histories" DROP COLUMN "transaction_id"`);
        await queryRunner.query(`ALTER TABLE "store_transaction_histories" ADD "transaction_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_transaction_histories" DROP COLUMN "transaction_id"`);
        await queryRunner.query(`ALTER TABLE "store_transaction_histories" ADD "transaction_id" integer`);
    }

}
