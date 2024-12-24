import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDriverTable1735026555231 implements MigrationInterface {
    name = 'AlterDriverTable1735026555231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drivers" ADD "submitted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "submitted_at"`);
    }

}
