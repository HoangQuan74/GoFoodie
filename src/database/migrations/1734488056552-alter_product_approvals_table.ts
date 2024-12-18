import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterProductApprovalsTable1734488056552 implements MigrationInterface {
    name = 'AlterProductApprovalsTable1734488056552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_approvals" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "product_approvals" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "product_approvals" ADD "image_id" uuid`);
        await queryRunner.query(`ALTER TABLE "product_approvals" ADD "reason" character varying`);
        await queryRunner.query(`ALTER TABLE "product_approvals" ADD CONSTRAINT "FK_789646ef993a391586d4d39e31b" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_approvals" DROP CONSTRAINT "FK_789646ef993a391586d4d39e31b"`);
        await queryRunner.query(`ALTER TABLE "product_approvals" DROP COLUMN "reason"`);
        await queryRunner.query(`ALTER TABLE "product_approvals" DROP COLUMN "image_id"`);
        await queryRunner.query(`ALTER TABLE "product_approvals" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "product_approvals" DROP COLUMN "name"`);
    }

}
