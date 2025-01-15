import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterCartProductsTable1736926288533 implements MigrationInterface {
    name = 'AlterCartProductsTable1736926288533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_products" DROP CONSTRAINT "FK_ebc4fe8eabf38786bb86cda0b9f"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_827238d000b9471b9abea68fa3" ON "carts" ("client_id", "store_id") `);
        await queryRunner.query(`ALTER TABLE "cart_products" ADD CONSTRAINT "FK_ebc4fe8eabf38786bb86cda0b9f" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_products" DROP CONSTRAINT "FK_ebc4fe8eabf38786bb86cda0b9f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_827238d000b9471b9abea68fa3"`);
        await queryRunner.query(`ALTER TABLE "cart_products" ADD CONSTRAINT "FK_ebc4fe8eabf38786bb86cda0b9f" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
