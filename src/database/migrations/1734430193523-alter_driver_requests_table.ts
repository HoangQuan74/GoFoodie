import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDriverRequestsTable1734430193523 implements MigrationInterface {
    name = 'AlterDriverRequestsTable1734430193523'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD "reject_reason" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP COLUMN "reject_reason"`);
    }

}
