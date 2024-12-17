import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductApprovalsTable1734403396226 implements MigrationInterface {
    name = 'CreateProductApprovalsTable1734403396226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."product_approvals_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "product_approvals" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "product_id" integer NOT NULL, "merchant_id" integer NOT NULL, "status" "public"."product_approvals_status_enum" NOT NULL DEFAULT 'pending', "processed_at" TIMESTAMP, "processed_by_id" integer, CONSTRAINT "PK_cb242906cb22f3e302cf4e165d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_approvals" ADD CONSTRAINT "FK_f8633898b43c2ddc151b02855e8" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_approvals" ADD CONSTRAINT "FK_4c641a2b0d505593dbf994e17b8" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_approvals" ADD CONSTRAINT "FK_b0167a886486b7008ab25c9206b" FOREIGN KEY ("processed_by_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_approvals" DROP CONSTRAINT "FK_b0167a886486b7008ab25c9206b"`);
        await queryRunner.query(`ALTER TABLE "product_approvals" DROP CONSTRAINT "FK_4c641a2b0d505593dbf994e17b8"`);
        await queryRunner.query(`ALTER TABLE "product_approvals" DROP CONSTRAINT "FK_f8633898b43c2ddc151b02855e8"`);
        await queryRunner.query(`DROP TABLE "product_approvals"`);
        await queryRunner.query(`DROP TYPE "public"."product_approvals_status_enum"`);
    }

}
