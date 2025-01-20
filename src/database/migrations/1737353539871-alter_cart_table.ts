import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterCartTable1737353539871 implements MigrationInterface {
    name = 'AlterCartTable1737353539871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_products" DROP CONSTRAINT "FK_ebc4fe8eabf38786bb86cda0b9f"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_827238d000b9471b9abea68fa3"`);
        await queryRunner.query(`CREATE INDEX "IDX_827238d000b9471b9abea68fa3" ON "carts" ("client_id", "store_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "cart_products" ADD CONSTRAINT "FK_ebc4fe8eabf38786bb86cda0b9f" FOREIGN KEY ("cart_id") REFERENCES "carts"("id")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_827238d000b9471b9abea68fa3"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_827238d000b9471b9abea68fa3" ON "carts" ("client_id", "store_id") `);
    }

}
