import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterBannersTable1735521062604 implements MigrationInterface {
    name = 'AlterBannersTable1735521062604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banners" ADD CONSTRAINT "FK_4ece2bd0b68375b878351af999d" FOREIGN KEY ("position") REFERENCES "banner_positions"("value") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banners" DROP CONSTRAINT "FK_4ece2bd0b68375b878351af999d"`);
    }

}
