import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterClientAddressTable1736482101839 implements MigrationInterface {
    name = 'AlterClientAddressTable1736482101839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_addresses" ADD "note" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_addresses" DROP COLUMN "note"`);
    }

}
