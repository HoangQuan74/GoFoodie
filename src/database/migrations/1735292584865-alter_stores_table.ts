import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoresTable1735292584865 implements MigrationInterface {
    name = 'AlterStoresTable1735292584865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP COLUMN "personal_tax_code"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD "personal_tax_code" character varying`);
    }

}
