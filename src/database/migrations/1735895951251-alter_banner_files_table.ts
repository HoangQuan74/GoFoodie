import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterBannerFilesTable1735895951251 implements MigrationInterface {
    name = 'AlterBannerFilesTable1735895951251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banner_files" ADD "tags" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banner_files" DROP COLUMN "tags"`);
    }

}
