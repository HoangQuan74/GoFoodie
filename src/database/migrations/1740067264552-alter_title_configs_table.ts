import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTitleConfigsTable1740067264552 implements MigrationInterface {
    name = 'AlterTitleConfigsTable1740067264552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "title_configs" ALTER COLUMN "end_time" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "title_configs" ALTER COLUMN "end_time" SET NOT NULL`);
    }

}
