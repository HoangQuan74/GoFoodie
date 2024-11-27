import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreRepresentativesTable1732725263716 implements MigrationInterface {
    name = 'AlterStoreRepresentativesTable1732725263716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD "related_image_id" uuid`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_65cc42c7fa635a1c51ceb08ee02" FOREIGN KEY ("related_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_65cc42c7fa635a1c51ceb08ee02"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP COLUMN "related_image_id"`);
    }

}
