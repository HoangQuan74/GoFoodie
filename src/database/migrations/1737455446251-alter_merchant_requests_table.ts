import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterMerchantRequestsTable1737455446251 implements MigrationInterface {
    name = 'AlterMerchantRequestsTable1737455446251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchant_requests" ADD "reason" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchant_requests" DROP COLUMN "reason"`);
    }

}
