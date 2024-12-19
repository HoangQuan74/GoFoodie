import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterProductsTable1734572235795 implements MigrationInterface {
    name = 'AlterProductsTable1734572235795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "reason" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "reason"`);
    }

}
