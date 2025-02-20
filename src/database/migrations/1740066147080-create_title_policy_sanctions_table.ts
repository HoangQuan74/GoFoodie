import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTitlePolicySanctionsTable1740066147080 implements MigrationInterface {
    name = 'CreateTitlePolicySanctionsTable1740066147080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "title_policies" DROP CONSTRAINT "FK_f9f2eab26aa8528626ccb9656ad"`);
        await queryRunner.query(`CREATE TABLE "title_policy_criteria" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_3ffeb687783db4c089425167fbe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "title_policy_sanctions" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b0c31f751b2e66ad05afcc5569d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "title_policies" DROP COLUMN "driverTitleId"`);
        await queryRunner.query(`ALTER TABLE "title_policies" ADD "criteria_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "title_policies" ADD "sanction_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "title_policies" ADD "title_id" integer`);
        await queryRunner.query(`ALTER TABLE "titles" ADD "status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "title_policies" ADD CONSTRAINT "FK_1cc470b4389c07ac07ab3edcacc" FOREIGN KEY ("title_id") REFERENCES "title_policies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "title_policies" ADD CONSTRAINT "FK_8ceb519f7f68642f6812e99f79e" FOREIGN KEY ("criteria_id") REFERENCES "title_policy_criteria"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "title_policies" ADD CONSTRAINT "FK_254d92725da91ee8d7e5aebfc3a" FOREIGN KEY ("sanction_id") REFERENCES "title_policy_sanctions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "title_policies" DROP CONSTRAINT "FK_254d92725da91ee8d7e5aebfc3a"`);
        await queryRunner.query(`ALTER TABLE "title_policies" DROP CONSTRAINT "FK_8ceb519f7f68642f6812e99f79e"`);
        await queryRunner.query(`ALTER TABLE "title_policies" DROP CONSTRAINT "FK_1cc470b4389c07ac07ab3edcacc"`);
        await queryRunner.query(`ALTER TABLE "titles" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "title_policies" DROP COLUMN "title_id"`);
        await queryRunner.query(`ALTER TABLE "title_policies" DROP COLUMN "sanction_id"`);
        await queryRunner.query(`ALTER TABLE "title_policies" DROP COLUMN "criteria_id"`);
        await queryRunner.query(`ALTER TABLE "title_policies" ADD "driverTitleId" integer`);
        await queryRunner.query(`DROP TABLE "title_policy_sanctions"`);
        await queryRunner.query(`DROP TABLE "title_policy_criteria"`);
        await queryRunner.query(`ALTER TABLE "title_policies" ADD CONSTRAINT "FK_f9f2eab26aa8528626ccb9656ad" FOREIGN KEY ("driverTitleId") REFERENCES "title_policies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
