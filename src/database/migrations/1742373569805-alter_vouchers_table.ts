import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterVouchersTable1742373569805 implements MigrationInterface {
    name = 'AlterVouchersTable1742373569805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vouchers" ADD "is_combine" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vouchers" DROP COLUMN "is_combine"`);
    }

}
