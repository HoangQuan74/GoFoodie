import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreSpecialWorkingTimeTable1733116346157 implements MigrationInterface {
    name = 'AlterStoreSpecialWorkingTimeTable1733116346157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_special_working_time" DROP COLUMN "open_time"`);
        await queryRunner.query(`ALTER TABLE "store_special_working_time" DROP COLUMN "close_time"`);
        await queryRunner.query(`ALTER TABLE "store_special_working_time" ADD "start_time" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_special_working_time" ADD "end_time" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_special_working_time" ALTER COLUMN "is_open" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_special_working_time" ALTER COLUMN "is_open" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "store_special_working_time" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "store_special_working_time" DROP COLUMN "start_time"`);
        await queryRunner.query(`ALTER TABLE "store_special_working_time" ADD "close_time" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_special_working_time" ADD "open_time" integer NOT NULL`);
    }

}
