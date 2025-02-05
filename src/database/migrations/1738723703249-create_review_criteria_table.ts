import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateReviewCriteriaTable1738723703249 implements MigrationInterface {
    name = 'CreateReviewCriteriaTable1738723703249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "review_criteria" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b1ab66a01e71d2aed265eda3844" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "review_templates" ADD "criteria_id" integer`);
        await queryRunner.query(`ALTER TABLE "review_templates" ADD CONSTRAINT "FK_e86656b25a824511d7cca13c593" FOREIGN KEY ("criteria_id") REFERENCES "review_criteria"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review_templates" DROP CONSTRAINT "FK_e86656b25a824511d7cca13c593"`);
        await queryRunner.query(`ALTER TABLE "review_templates" DROP COLUMN "criteria_id"`);
        await queryRunner.query(`DROP TABLE "review_criteria"`);
    }

}
