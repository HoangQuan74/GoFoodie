import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAdminsTable1733985773808 implements MigrationInterface {
    name = 'AlterAdminsTable1733985773808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" RENAME COLUMN "username" TO "phone"`);
        await queryRunner.query(`ALTER TABLE "admins" ALTER COLUMN "phone" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" ALTER COLUMN "phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admins" RENAME COLUMN "phone" TO "username"`);
    }

}
