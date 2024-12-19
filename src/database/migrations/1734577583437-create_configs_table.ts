import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConfigsTable1734577583437 implements MigrationInterface {
    name = 'CreateConfigsTable1734577583437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."configs_type_enum" AS ENUM('app_driver', 'app_merchant', 'web_admin')`);
        await queryRunner.query(`CREATE TABLE "configs" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "value" text NOT NULL, "type" "public"."configs_type_enum" NOT NULL, CONSTRAINT "PK_002b633ec0d45f5c6f928fea292" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "configs"`);
        await queryRunner.query(`DROP TYPE "public"."configs_type_enum"`);
    }

}
