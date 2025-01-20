import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChallengesTable1737362506324 implements MigrationInterface {
    name = 'CreateChallengesTable1737362506324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "challenge_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_dd547f44fd8d01bb2368f7b3b9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "challenges" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "code" character varying NOT NULL, "duration" integer NOT NULL, "description" text NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "is_limited_budget" boolean NOT NULL, "budget" integer NOT NULL, "reward" integer NOT NULL, "position_value" character varying NOT NULL, "type_id" integer NOT NULL, "service_type_id" integer NOT NULL, CONSTRAINT "PK_1e664e93171e20fe4d6125466af" PRIMARY KEY ("id")); COMMENT ON COLUMN "challenges"."duration" IS 'Duration in days'`);
        await queryRunner.query(`CREATE TABLE "challenge_criteria" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "challenge_id" integer NOT NULL, "type" character varying NOT NULL, "value" text NOT NULL, CONSTRAINT "PK_52f11dcae14da610f39e7f001fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "challenges" ADD CONSTRAINT "FK_40d8a39d9a8d5f84ac2c17bf624" FOREIGN KEY ("type_id") REFERENCES "challenge_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenges" ADD CONSTRAINT "FK_9bb70df8f84617593eb49975cb0" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenges" ADD CONSTRAINT "FK_b95d3c182ca8f49af808a1396be" FOREIGN KEY ("position_value") REFERENCES "banner_positions"("value") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenge_criteria" ADD CONSTRAINT "FK_6676dcd288ee0687173531a8980" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "challenge_criteria" DROP CONSTRAINT "FK_6676dcd288ee0687173531a8980"`);
        await queryRunner.query(`ALTER TABLE "challenges" DROP CONSTRAINT "FK_b95d3c182ca8f49af808a1396be"`);
        await queryRunner.query(`ALTER TABLE "challenges" DROP CONSTRAINT "FK_9bb70df8f84617593eb49975cb0"`);
        await queryRunner.query(`ALTER TABLE "challenges" DROP CONSTRAINT "FK_40d8a39d9a8d5f84ac2c17bf624"`);
        await queryRunner.query(`DROP TABLE "challenge_criteria"`);
        await queryRunner.query(`DROP TABLE "challenges"`);
        await queryRunner.query(`DROP TABLE "challenge_types"`);
    }

}
