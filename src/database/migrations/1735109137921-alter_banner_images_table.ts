import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterBannerImagesTable1735109137921 implements MigrationInterface {
    name = 'AlterBannerImagesTable1735109137921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banner_images" ADD "sort" SERIAL NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banner_images" DROP COLUMN "sort"`);
    }

}
