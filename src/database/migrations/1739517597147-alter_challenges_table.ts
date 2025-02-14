import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterChallengesTable1739517597147 implements MigrationInterface {
    name = 'AlterChallengesTable1739517597147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "challenges" ADD "used_budget" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "challenges" DROP COLUMN "used_budget"`);
    }

}
