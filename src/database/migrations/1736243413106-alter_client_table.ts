import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterClientTable1736243413106 implements MigrationInterface {
    name = 'AlterClientTable1736243413106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "latitude" double precision`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "longitude" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "longitude" integer`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "latitude" integer`);
    }

}
