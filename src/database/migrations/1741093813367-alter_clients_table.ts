import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterClientsTable1741093813367 implements MigrationInterface {
    name = 'AlterClientsTable1741093813367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" ADD "coins" bigint NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "coins"`);
    }

}
