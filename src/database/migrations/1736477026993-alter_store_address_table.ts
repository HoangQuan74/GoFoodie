import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreAddressTable1736477026993 implements MigrationInterface {
    name = 'AlterStoreAddressTable1736477026993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_address" ADD "note" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_address" DROP COLUMN "note"`);
    }

}
