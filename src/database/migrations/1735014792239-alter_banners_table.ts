import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterBannersTable1735014792239 implements MigrationInterface {
    name = 'AlterBannersTable1735014792239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "banner_criteria" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "banner_id" integer NOT NULL, "type" character varying NOT NULL, "value" text NOT NULL, CONSTRAINT "PK_d9ab2982bdb1f830f12b94c94f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."banner_images_link_type_enum" AS ENUM('none', 'criteria')`);
        await queryRunner.query(`CREATE TABLE "banner_images" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "bannerId" character varying NOT NULL, "imageId" character varying NOT NULL, "title" character varying, "description" character varying, "link" character varying, "link_type" "public"."banner_images_link_type_enum" NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "banner_id" integer, "image_id" uuid, CONSTRAINT "PK_79cfe307b1e0e645620b7b48cfa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "banner_criteria" ADD CONSTRAINT "FK_18b29afbb04f4cc285a38ea903c" FOREIGN KEY ("banner_id") REFERENCES "banners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "banner_images" ADD CONSTRAINT "FK_29c68f26bdfb0ec2ec1a24e898e" FOREIGN KEY ("banner_id") REFERENCES "banners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "banner_images" ADD CONSTRAINT "FK_a12e84f5458c58965ef24343cee" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banner_images" DROP CONSTRAINT "FK_a12e84f5458c58965ef24343cee"`);
        await queryRunner.query(`ALTER TABLE "banner_images" DROP CONSTRAINT "FK_29c68f26bdfb0ec2ec1a24e898e"`);
        await queryRunner.query(`ALTER TABLE "banner_criteria" DROP CONSTRAINT "FK_18b29afbb04f4cc285a38ea903c"`);
        await queryRunner.query(`DROP TABLE "banner_images"`);
        await queryRunner.query(`DROP TYPE "public"."banner_images_link_type_enum"`);
        await queryRunner.query(`DROP TABLE "banner_criteria"`);
    }

}
