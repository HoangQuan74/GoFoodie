import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterBannersTable1735015156061 implements MigrationInterface {
    name = 'AlterBannersTable1735015156061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banner_images" DROP CONSTRAINT "FK_29c68f26bdfb0ec2ec1a24e898e"`);
        await queryRunner.query(`ALTER TABLE "banner_criteria" DROP CONSTRAINT "FK_18b29afbb04f4cc285a38ea903c"`);
        await queryRunner.query(`ALTER TABLE "banner_images" DROP COLUMN "bannerId"`);
        await queryRunner.query(`ALTER TABLE "banner_images" ALTER COLUMN "banner_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "banner_images" ADD CONSTRAINT "FK_29c68f26bdfb0ec2ec1a24e898e" FOREIGN KEY ("banner_id") REFERENCES "banners"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "banner_criteria" ADD CONSTRAINT "FK_18b29afbb04f4cc285a38ea903c" FOREIGN KEY ("banner_id") REFERENCES "banners"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banner_criteria" DROP CONSTRAINT "FK_18b29afbb04f4cc285a38ea903c"`);
        await queryRunner.query(`ALTER TABLE "banner_images" DROP CONSTRAINT "FK_29c68f26bdfb0ec2ec1a24e898e"`);
        await queryRunner.query(`ALTER TABLE "banner_images" ALTER COLUMN "banner_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "banner_images" ADD "bannerId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "banner_criteria" ADD CONSTRAINT "FK_18b29afbb04f4cc285a38ea903c" FOREIGN KEY ("banner_id") REFERENCES "banners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "banner_images" ADD CONSTRAINT "FK_29c68f26bdfb0ec2ec1a24e898e" FOREIGN KEY ("banner_id") REFERENCES "banners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
