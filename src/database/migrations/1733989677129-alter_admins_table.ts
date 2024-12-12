import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAdminsTable1733989677129 implements MigrationInterface {
    name = 'AlterAdminsTable1733989677129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" ADD "is_root" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" DROP COLUMN "is_root"`);
    }

}
