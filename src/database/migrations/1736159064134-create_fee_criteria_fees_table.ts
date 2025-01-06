import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFeeCriteriaFeesTable1736159064134 implements MigrationInterface {
    name = 'CreateFeeCriteriaFeesTable1736159064134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_fees" DROP CONSTRAINT "FK_98ea9c7632e1557248c21227c17"`);
        await queryRunner.query(`CREATE TABLE "fee_criteria" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "fee_id" integer NOT NULL, "type" character varying NOT NULL, "value" text NOT NULL, CONSTRAINT "PK_09d22e0dd0b7e977c6140e51123" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "app_fees" ADD CONSTRAINT "FK_98ea9c7632e1557248c21227c17" FOREIGN KEY ("fee_id") REFERENCES "fees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fee_criteria" ADD CONSTRAINT "FK_f181183d7888d006c2730a86b89" FOREIGN KEY ("fee_id") REFERENCES "fees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fees" ADD CONSTRAINT "FK_af1e4ad597a5033520b26d1ce31" FOREIGN KEY ("created_by_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fees" DROP CONSTRAINT "FK_af1e4ad597a5033520b26d1ce31"`);
        await queryRunner.query(`ALTER TABLE "fee_criteria" DROP CONSTRAINT "FK_f181183d7888d006c2730a86b89"`);
        await queryRunner.query(`ALTER TABLE "app_fees" DROP CONSTRAINT "FK_98ea9c7632e1557248c21227c17"`);
        await queryRunner.query(`DROP TABLE "fee_criteria"`);
        await queryRunner.query(`ALTER TABLE "app_fees" ADD CONSTRAINT "FK_98ea9c7632e1557248c21227c17" FOREIGN KEY ("fee_id") REFERENCES "fees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
