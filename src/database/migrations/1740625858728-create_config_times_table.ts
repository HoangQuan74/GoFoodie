import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConfigTimesTable1740625858728 implements MigrationInterface {
    name = 'CreateConfigTimesTable1740625858728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "config_times" ("key" character varying NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_9d295270a1c42dbc4c9874bb796" PRIMARY KEY ("key"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "config_times"`);
    }

}
