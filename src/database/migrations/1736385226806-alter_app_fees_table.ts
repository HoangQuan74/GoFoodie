import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAppFeesTable1736385226806 implements MigrationInterface {
    name = 'AlterAppFeesTable1736385226806'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_fees" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "app_fees" ADD "value" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_fees" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "app_fees" ADD "value" integer NOT NULL`);
    }

}
