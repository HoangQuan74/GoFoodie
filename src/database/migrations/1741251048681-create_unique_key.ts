import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUniqueKey1741251048681 implements MigrationInterface {
    name = 'CreateUniqueKey1741251048681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher_products" DROP CONSTRAINT "FK_38e6b4f1fa0d37d662a9c0b60f8"`);
        await queryRunner.query(`ALTER TABLE "client_review_drivers" ADD CONSTRAINT "UQ_028734d885545525635f77d2ca6" UNIQUE ("client_id", "driver_id", "order_id")`);
        await queryRunner.query(`ALTER TABLE "client_review_stores" ADD CONSTRAINT "UQ_eacc6a3d8f14007cd56d4e68ab7" UNIQUE ("client_id", "store_id", "order_id")`);
        await queryRunner.query(`ALTER TABLE "voucher_products" ADD CONSTRAINT "FK_38e6b4f1fa0d37d662a9c0b60f8" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher_products" DROP CONSTRAINT "FK_38e6b4f1fa0d37d662a9c0b60f8"`);
        await queryRunner.query(`ALTER TABLE "client_review_stores" DROP CONSTRAINT "UQ_eacc6a3d8f14007cd56d4e68ab7"`);
        await queryRunner.query(`ALTER TABLE "client_review_drivers" DROP CONSTRAINT "UQ_028734d885545525635f77d2ca6"`);
        await queryRunner.query(`ALTER TABLE "voucher_products" ADD CONSTRAINT "FK_38e6b4f1fa0d37d662a9c0b60f8" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
