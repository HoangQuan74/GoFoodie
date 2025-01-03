import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterBannersTable1735889580768 implements MigrationInterface {
    name = 'AlterBannersTable1735889580768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "banner_change_types" ("value" character varying NOT NULL, "label" character varying NOT NULL, CONSTRAINT "PK_54a29f7342dbc5092e0a7b7bf3d" PRIMARY KEY ("value"))`);
        await queryRunner.query(`ALTER TABLE "banner_files" ADD "change_time" integer`);
        await queryRunner.query(`ALTER TABLE "banner_files" ADD "change_speed" integer`);
        await queryRunner.query(`ALTER TABLE "banners" ADD "view_all_link" character varying`);
        await queryRunner.query(`ALTER TABLE "banners" ADD "change_type" character varying`);
        await queryRunner.query(`ALTER TABLE "banners" ADD CONSTRAINT "FK_f565714436df1945a984f9f718a" FOREIGN KEY ("change_type") REFERENCES "banner_change_types"("value") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banners" DROP CONSTRAINT "FK_f565714436df1945a984f9f718a"`);
        await queryRunner.query(`ALTER TABLE "banners" DROP COLUMN "change_type"`);
        await queryRunner.query(`ALTER TABLE "banners" DROP COLUMN "view_all_link"`);
        await queryRunner.query(`ALTER TABLE "banner_files" DROP COLUMN "change_speed"`);
        await queryRunner.query(`ALTER TABLE "banner_files" DROP COLUMN "change_time"`);
        await queryRunner.query(`DROP TABLE "banner_change_types"`);
    }

}
