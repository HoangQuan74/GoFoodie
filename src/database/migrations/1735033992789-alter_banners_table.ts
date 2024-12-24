import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterBannersTable1735033992789 implements MigrationInterface {
    name = 'AlterBannersTable1735033992789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banners" ADD "code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "banners" ADD "created_by_id" integer`);
        await queryRunner.query(`ALTER TABLE "banners" ADD CONSTRAINT "FK_46df092f036249ece508ae904b3" FOREIGN KEY ("created_by_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banners" DROP CONSTRAINT "FK_46df092f036249ece508ae904b3"`);
        await queryRunner.query(`ALTER TABLE "banners" DROP COLUMN "created_by_id"`);
        await queryRunner.query(`ALTER TABLE "banners" DROP COLUMN "code"`);
    }

}
