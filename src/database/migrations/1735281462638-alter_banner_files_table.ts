import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterBannerFilesTable1735281462638 implements MigrationInterface {
    name = 'AlterBannerFilesTable1735281462638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."banner_files_link_type_enum" AS ENUM('none', 'criteria')`);
        await queryRunner.query(`CREATE TABLE "banner_files" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "banner_id" integer NOT NULL, "fileId" character varying NOT NULL, "sort" SERIAL NOT NULL, "title" character varying, "description" character varying, "link" character varying, "video_thumbnail_id" character varying, "link_type" "public"."banner_files_link_type_enum" NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "file_id" uuid, CONSTRAINT "PK_1db638e4dee9f4a61bd414168db" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "banner_files" ADD CONSTRAINT "FK_e274c260c6612da86350705602c" FOREIGN KEY ("banner_id") REFERENCES "banners"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "banner_files" ADD CONSTRAINT "FK_e40c3fbfd7dc16b831c8e765bff" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banner_files" DROP CONSTRAINT "FK_e40c3fbfd7dc16b831c8e765bff"`);
        await queryRunner.query(`ALTER TABLE "banner_files" DROP CONSTRAINT "FK_e274c260c6612da86350705602c"`);
        await queryRunner.query(`DROP TABLE "banner_files"`);
        await queryRunner.query(`DROP TYPE "public"."banner_files_link_type_enum"`);
    }

}
