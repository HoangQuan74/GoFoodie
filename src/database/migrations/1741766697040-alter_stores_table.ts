import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoresTable1741766697040 implements MigrationInterface {
    name = 'AlterStoresTable1741766697040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD "pin" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "pin"`);
    }

}
