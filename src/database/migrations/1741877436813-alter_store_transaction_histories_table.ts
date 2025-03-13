import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreTransactionHistoriesTable1741877436813 implements MigrationInterface {
    name = 'AlterStoreTransactionHistoriesTable1741877436813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_transaction_histories" ADD "fee" bigint NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_transaction_histories" DROP COLUMN "fee"`);
    }

}
