import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterProductApprovalsTable1734406674285 implements MigrationInterface {
    name = 'AlterProductApprovalsTable1734406674285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."product_approvals_type_enum" AS ENUM('create', 'update')`);
        await queryRunner.query(`ALTER TABLE "product_approvals" ADD "type" "public"."product_approvals_type_enum" NOT NULL DEFAULT 'create'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_approvals" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."product_approvals_type_enum"`);
    }

}
