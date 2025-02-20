import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTitleConfigsTable1740068198866 implements MigrationInterface {
    name = 'AlterTitleConfigsTable1740068198866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "titles" ADD "benefit_id" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "titles" DROP COLUMN "benefit_id"`);
    }

}
