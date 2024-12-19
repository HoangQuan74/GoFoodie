import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterServiceTypesTable1734595937409 implements MigrationInterface {
    name = 'AlterServiceTypesTable1734595937409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provinces" ADD "short_name" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "service_types" ADD "code" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_types" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "provinces" DROP COLUMN "short_name"`);
    }

}
