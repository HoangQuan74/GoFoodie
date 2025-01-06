import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVoucherProductsTable1736151715039 implements MigrationInterface {
    name = 'CreateVoucherProductsTable1736151715039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "voucher_products" ("voucher_id" integer NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "PK_81465fa8dc95f93269ef8dd5f78" PRIMARY KEY ("voucher_id", "product_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8cef826f1359012a2a3dd00f28" ON "voucher_products" ("voucher_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_38e6b4f1fa0d37d662a9c0b60f" ON "voucher_products" ("product_id") `);
        await queryRunner.query(`ALTER TABLE "voucher_products" ADD CONSTRAINT "FK_8cef826f1359012a2a3dd00f28d" FOREIGN KEY ("voucher_id") REFERENCES "vouchers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "voucher_products" ADD CONSTRAINT "FK_38e6b4f1fa0d37d662a9c0b60f8" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher_products" DROP CONSTRAINT "FK_38e6b4f1fa0d37d662a9c0b60f8"`);
        await queryRunner.query(`ALTER TABLE "voucher_products" DROP CONSTRAINT "FK_8cef826f1359012a2a3dd00f28d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_38e6b4f1fa0d37d662a9c0b60f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8cef826f1359012a2a3dd00f28"`);
        await queryRunner.query(`DROP TABLE "voucher_products"`);
    }

}
