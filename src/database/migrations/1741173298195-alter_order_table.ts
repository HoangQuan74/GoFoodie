import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterOrderTable1741173298195 implements MigrationInterface {
    name = 'AlterOrderTable1741173298195'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "client_app_fee" numeric(10,0) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "client_app_fee"`);
    }

}
