import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterFeesTables1737520897201 implements MigrationInterface {
    name = 'AlterFeesTables1737520897201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fee_types" ADD "value" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fee_types" DROP COLUMN "value"`);
    }

}
