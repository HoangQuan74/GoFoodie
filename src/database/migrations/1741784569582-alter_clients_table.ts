import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterClientsTable1741784569582 implements MigrationInterface {
    name = 'AlterClientsTable1741784569582'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" ADD "date_of_birth" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "date_of_birth"`);
    }

}
