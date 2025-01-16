import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVoucherStoresTable1737000520451 implements MigrationInterface {
    name = 'CreateVoucherStoresTable1737000520451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "voucher_stores" ("voucher_id" integer NOT NULL, "store_id" integer NOT NULL, CONSTRAINT "PK_da57ccca4a88426174845cd9396" PRIMARY KEY ("voucher_id", "store_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5be2e8267587518a949adf5be9" ON "voucher_stores" ("voucher_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_040c482e5f2d7f7ee01caa5a1b" ON "voucher_stores" ("store_id") `);
        await queryRunner.query(`ALTER TABLE "voucher_stores" ADD CONSTRAINT "FK_5be2e8267587518a949adf5be98" FOREIGN KEY ("voucher_id") REFERENCES "vouchers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "voucher_stores" ADD CONSTRAINT "FK_040c482e5f2d7f7ee01caa5a1b9" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher_stores" DROP CONSTRAINT "FK_040c482e5f2d7f7ee01caa5a1b9"`);
        await queryRunner.query(`ALTER TABLE "voucher_stores" DROP CONSTRAINT "FK_5be2e8267587518a949adf5be98"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_040c482e5f2d7f7ee01caa5a1b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5be2e8267587518a949adf5be9"`);
        await queryRunner.query(`DROP TABLE "voucher_stores"`);
    }

}
