import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterFeesTable1736157181532 implements MigrationInterface {
    name = 'AlterFeesTable1736157181532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fees" RENAME COLUMN "isActive" TO "is_active"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fees" RENAME COLUMN "is_active" TO "isActive"`);
    }

}
