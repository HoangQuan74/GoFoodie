import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterMerchantsTable1732795211543 implements MigrationInterface {
    name = 'AlterMerchantsTable1732795211543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchants" ADD "store_id" integer`);
        await queryRunner.query(`ALTER TABLE "merchants" ADD CONSTRAINT "FK_852d9f0a02aeb0be90177155285" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchants" DROP CONSTRAINT "FK_852d9f0a02aeb0be90177155285"`);
        await queryRunner.query(`ALTER TABLE "merchants" DROP COLUMN "store_id"`);
    }

}
