import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDriverRequestsTable1734428674779 implements MigrationInterface {
    name = 'AlterDriverRequestsTable1734428674779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD "processed_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP COLUMN "processed_at"`);
    }

}
