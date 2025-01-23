import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterChallengesTable1737646458854 implements MigrationInterface {
    name = 'AlterChallengesTable1737646458854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "challenges" ADD "created_by_id" integer`);
        await queryRunner.query(`ALTER TABLE "challenges" ADD CONSTRAINT "FK_a94abe45e0cf677ccb9222219a9" FOREIGN KEY ("created_by_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "challenges" DROP CONSTRAINT "FK_a94abe45e0cf677ccb9222219a9"`);
        await queryRunner.query(`ALTER TABLE "challenges" DROP COLUMN "created_by_id"`);
    }

}
