import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreTable1740496102016 implements MigrationInterface {
    name = 'AlterStoreTable1740496102016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD "title_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "title_id"`);
    }

}
