import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateServiceTypesTable1732545692943 implements MigrationInterface {
    name = 'CreateServiceTypesTable1732545692943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "service_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_1dc93417a097cdee3491f39d7cc" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "service_types"`);
    }

}
