import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterBannerFilesTable1735347332073 implements MigrationInterface {
    name = 'AlterBannerFilesTable1735347332073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banner_files" DROP COLUMN "fileId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banner_files" ADD "fileId" character varying NOT NULL`);
    }

}
