import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDriverTable1735788674316 implements MigrationInterface {
    name = 'AlterDriverTable1735788674316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drivers" ADD "balance" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "balance"`);
    }

}
