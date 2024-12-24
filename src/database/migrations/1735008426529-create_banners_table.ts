import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBannersTable1735008426529 implements MigrationInterface {
    name = 'CreateBannersTable1735008426529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."banners_app_type_enum" AS ENUM('app_driver', 'app_merchant', 'app_client')`);
        await queryRunner.query(`CREATE TYPE "public"."banners_display_type_enum" AS ENUM('image', 'video')`);
        await queryRunner.query(`CREATE TABLE "banners" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "app_type" "public"."banners_app_type_enum" NOT NULL, "type" character varying NOT NULL, "display_type" "public"."banners_display_type_enum" NOT NULL, "position" character varying NOT NULL, "start_date" TIMESTAMP NOT NULL DEFAULT now(), "end_date" TIMESTAMP, "description" character varying, CONSTRAINT "PK_e9b186b959296fcb940790d31c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "files" ADD "is_public" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TYPE "public"."configs_type_enum" RENAME TO "configs_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."configs_type_enum" AS ENUM('app_driver', 'app_merchant', 'web_admin', 'app_client')`);
        await queryRunner.query(`ALTER TABLE "configs" ALTER COLUMN "type" TYPE "public"."configs_type_enum" USING "type"::"text"::"public"."configs_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."configs_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."configs_type_enum_old" AS ENUM('app_driver', 'app_merchant', 'web_admin')`);
        await queryRunner.query(`ALTER TABLE "configs" ALTER COLUMN "type" TYPE "public"."configs_type_enum_old" USING "type"::"text"::"public"."configs_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."configs_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."configs_type_enum_old" RENAME TO "configs_type_enum"`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "is_public"`);
        await queryRunner.query(`DROP TABLE "banners"`);
        await queryRunner.query(`DROP TYPE "public"."banners_display_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."banners_app_type_enum"`);
    }

}
