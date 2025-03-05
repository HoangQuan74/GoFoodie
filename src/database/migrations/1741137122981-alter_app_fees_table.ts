import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAppFeesTable1741137122981 implements MigrationInterface {
    name = 'AlterAppFeesTable1741137122981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_fees" ADD "description" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_fees" DROP COLUMN "description"`);
    }

}
