import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterProductsTable1734330598693 implements MigrationInterface {
    name = 'AlterProductsTable1734330598693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."products_approval_status_enum" AS ENUM('draft', 'pending', 'approved', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "products" ADD "approval_status" "public"."products_approval_status_enum" NOT NULL DEFAULT 'approved'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "approval_status"`);
        await queryRunner.query(`DROP TYPE "public"."products_approval_status_enum"`);
    }

}
