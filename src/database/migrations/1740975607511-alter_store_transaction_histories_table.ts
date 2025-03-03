import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreTransactionHistoriesTable1740975607511 implements MigrationInterface {
    name = 'AlterStoreTransactionHistoriesTable1740975607511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_transaction_histories" ADD "error_message" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_transaction_histories" DROP COLUMN "error_message"`);
    }

}
