import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterMerchantsTable1733833370554 implements MigrationInterface {
    name = 'AlterMerchantsTable1733833370554'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchants" ADD "device_token" character varying`);
        await queryRunner.query(`ALTER TABLE "merchants" ADD "last_login" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchants" DROP COLUMN "last_login"`);
        await queryRunner.query(`ALTER TABLE "merchants" DROP COLUMN "device_token"`);
    }

}
