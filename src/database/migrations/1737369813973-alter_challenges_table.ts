import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterChallengesTable1737369813973 implements MigrationInterface {
    name = 'AlterChallengesTable1737369813973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "challenges" ADD "image_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "challenges" ADD CONSTRAINT "FK_2ac771f5608abba079a6539fe41" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "challenges" DROP CONSTRAINT "FK_2ac771f5608abba079a6539fe41"`);
        await queryRunner.query(`ALTER TABLE "challenges" DROP COLUMN "image_id"`);
    }

}
