import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterProvincesTable1735804614265 implements MigrationInterface {
    name = 'AlterProvincesTable1735804614265'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provinces" ADD "code" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provinces" DROP COLUMN "code"`);
    }

}
