import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterClientsTable1736244387276 implements MigrationInterface {
    name = 'AlterClientsTable1736244387276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchants" ADD "avatar_id" uuid`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "avatar_id" uuid`);
        await queryRunner.query(`ALTER TABLE "merchants" ADD CONSTRAINT "FK_c60e77255fa1e970f212cecadcd" FOREIGN KEY ("avatar_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_3b6293458f11f0cd1230a5edfd7" FOREIGN KEY ("avatar_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_3b6293458f11f0cd1230a5edfd7"`);
        await queryRunner.query(`ALTER TABLE "merchants" DROP CONSTRAINT "FK_c60e77255fa1e970f212cecadcd"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "avatar_id"`);
        await queryRunner.query(`ALTER TABLE "merchants" DROP COLUMN "avatar_id"`);
    }

}
