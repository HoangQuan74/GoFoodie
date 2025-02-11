import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDriverBanksTable1739267371364 implements MigrationInterface {
    name = 'AlterDriverBanksTable1739267371364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_banks" ADD "is_default" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_banks" DROP COLUMN "is_default"`);
    }

}
