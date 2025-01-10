import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterClientAddressesTable1736489828361 implements MigrationInterface {
    name = 'AlterClientAddressesTable1736489828361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_addresses" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "client_addresses" ADD "latitude" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client_addresses" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "client_addresses" ADD "longitude" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_addresses" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "client_addresses" ADD "longitude" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client_addresses" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "client_addresses" ADD "latitude" integer NOT NULL`);
    }

}
