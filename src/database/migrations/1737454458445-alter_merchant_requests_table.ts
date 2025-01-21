import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterMerchantRequestsTable1737454458445 implements MigrationInterface {
    name = 'AlterMerchantRequestsTable1737454458445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchant_requests" ADD "approved_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchant_requests" DROP COLUMN "approved_at"`);
    }

}
