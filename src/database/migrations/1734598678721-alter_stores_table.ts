import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoresTable1734598678721 implements MigrationInterface {
    name = 'AlterStoresTable1734598678721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "store_code" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "store_code" SET NOT NULL`);
    }

}
