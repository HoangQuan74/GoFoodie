import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterMerchantTable1733802898725 implements MigrationInterface {
    name = 'AlterMerchantTable1733802898725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchants" ALTER COLUMN "name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchants" ALTER COLUMN "name" SET NOT NULL`);
    }

}
