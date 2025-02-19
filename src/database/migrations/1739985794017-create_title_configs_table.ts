import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTitleConfigsTable1739985794017 implements MigrationInterface {
    name = 'CreateTitleConfigsTable1739985794017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."title_configs_app_type_enum" AS ENUM('app_driver', 'app_merchant', 'app_client')`);
        await queryRunner.query(`CREATE TABLE "title_configs" ("id" SERIAL NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "app_type" "public"."title_configs_app_type_enum" NOT NULL, CONSTRAINT "PK_f87d9f3b54fbba250fb5b179be3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "titles" ("id" SERIAL NOT NULL, "title_config_id" integer NOT NULL, "title" character varying NOT NULL, "level" integer NOT NULL, "point" integer NOT NULL, "description" character varying NOT NULL, "icon_id" character varying NOT NULL, "icon_position" character varying NOT NULL, "iconId" uuid, CONSTRAINT "PK_7c5aeca381c331c3aaf9d50931c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "title_policies" ("id" SERIAL NOT NULL, "condition" character varying NOT NULL, "point" integer NOT NULL, "type" character varying NOT NULL, "frequency" character varying NOT NULL, "driverTitleId" integer, CONSTRAINT "PK_5634ad103ea6c65853838a58043" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "title_config_service_type" ("title_config_id" integer NOT NULL, "service_type_id" integer NOT NULL, CONSTRAINT "PK_83b2a0f535d2e0f022c4bf291e8" PRIMARY KEY ("title_config_id", "service_type_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5e761df7a63bbb10af1ea26caf" ON "title_config_service_type" ("title_config_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_72fea27b4cbf51b580423e50ac" ON "title_config_service_type" ("service_type_id") `);
        await queryRunner.query(`ALTER TABLE "titles" ADD CONSTRAINT "FK_9c00b176c5d7dc9484b2319a76b" FOREIGN KEY ("iconId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "titles" ADD CONSTRAINT "FK_5ea46c639d267bea2d2f5621465" FOREIGN KEY ("title_config_id") REFERENCES "title_configs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "title_policies" ADD CONSTRAINT "FK_f9f2eab26aa8528626ccb9656ad" FOREIGN KEY ("driverTitleId") REFERENCES "title_policies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "title_config_service_type" ADD CONSTRAINT "FK_5e761df7a63bbb10af1ea26caf1" FOREIGN KEY ("title_config_id") REFERENCES "title_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "title_config_service_type" ADD CONSTRAINT "FK_72fea27b4cbf51b580423e50acb" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "title_config_service_type" DROP CONSTRAINT "FK_72fea27b4cbf51b580423e50acb"`);
        await queryRunner.query(`ALTER TABLE "title_config_service_type" DROP CONSTRAINT "FK_5e761df7a63bbb10af1ea26caf1"`);
        await queryRunner.query(`ALTER TABLE "title_policies" DROP CONSTRAINT "FK_f9f2eab26aa8528626ccb9656ad"`);
        await queryRunner.query(`ALTER TABLE "titles" DROP CONSTRAINT "FK_5ea46c639d267bea2d2f5621465"`);
        await queryRunner.query(`ALTER TABLE "titles" DROP CONSTRAINT "FK_9c00b176c5d7dc9484b2319a76b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_72fea27b4cbf51b580423e50ac"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5e761df7a63bbb10af1ea26caf"`);
        await queryRunner.query(`DROP TABLE "title_config_service_type"`);
        await queryRunner.query(`DROP TABLE "title_policies"`);
        await queryRunner.query(`DROP TABLE "titles"`);
        await queryRunner.query(`DROP TABLE "title_configs"`);
        await queryRunner.query(`DROP TYPE "public"."title_configs_app_type_enum"`);
    }

}
