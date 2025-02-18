import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndex1739873958256 implements MigrationInterface {
    name = 'AddIndex1739873958256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_address" ADD CONSTRAINT "UQ_686b119890713941e86e97a7952" UNIQUE ("store_id", "type")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_address" DROP CONSTRAINT "UQ_686b119890713941e86e97a7952"`);
    }

}
