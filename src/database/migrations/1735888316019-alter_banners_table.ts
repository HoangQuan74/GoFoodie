import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterBannersTable1735888316019 implements MigrationInterface {
    name = 'AlterBannersTable1735888316019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banners" ADD CONSTRAINT "FK_3aaaace8c25a64f97dcd62de113" FOREIGN KEY ("type") REFERENCES "banner_types"("value") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banners" DROP CONSTRAINT "FK_3aaaace8c25a64f97dcd62de113"`);
    }

}
