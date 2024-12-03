import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOptionGroupsTable1733217773639 implements MigrationInterface {
    name = 'CreateOptionGroupsTable1733217773639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."option_groups_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "option_groups" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "store_id" integer NOT NULL, "is_multiple" boolean NOT NULL, "status" "public"."option_groups_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "PK_5078ac50f999db2431883a4dfb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."options_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "options" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "price" integer NOT NULL DEFAULT '0', "status" "public"."options_status_enum" NOT NULL DEFAULT 'active', "option_group_id" integer NOT NULL, CONSTRAINT "PK_d232045bdb5c14d932fba18d957" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "option_groups" ADD CONSTRAINT "FK_6dd4a34c9c0302f2cbe691cf5eb" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "options" ADD CONSTRAINT "FK_1ebcef25833b5bb7e60a84da3d0" FOREIGN KEY ("option_group_id") REFERENCES "option_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "options" DROP CONSTRAINT "FK_1ebcef25833b5bb7e60a84da3d0"`);
        await queryRunner.query(`ALTER TABLE "option_groups" DROP CONSTRAINT "FK_6dd4a34c9c0302f2cbe691cf5eb"`);
        await queryRunner.query(`DROP TABLE "options"`);
        await queryRunner.query(`DROP TYPE "public"."options_status_enum"`);
        await queryRunner.query(`DROP TABLE "option_groups"`);
        await queryRunner.query(`DROP TYPE "public"."option_groups_status_enum"`);
    }

}
