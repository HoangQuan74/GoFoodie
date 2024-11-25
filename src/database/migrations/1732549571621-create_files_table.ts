import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFilesTable1732549571621 implements MigrationInterface {
    name = 'CreateFilesTable1732549571621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "size" integer NOT NULL, "mimetype" character varying NOT NULL, "path" character varying NOT NULL, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "files"`);
    }

}
