import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCartProductOptionsTable1736915709589 implements MigrationInterface {
    name = 'CreateCartProductOptionsTable1736915709589'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flash_sales" DROP CONSTRAINT "FK_509f77d8450623f2ab437d003dc"`);
        await queryRunner.query(`CREATE TABLE "cart_product_options" ("cart_product_id" integer NOT NULL, "option_id" integer NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "PK_e1f34a5679fd5784d41688b4071" PRIMARY KEY ("cart_product_id", "option_id"))`);
        await queryRunner.query(`ALTER TABLE "flash_sales" DROP COLUMN "timeFrameId"`);
        await queryRunner.query(`ALTER TABLE "cart_products" DROP COLUMN "unit_price"`);
        await queryRunner.query(`ALTER TABLE "cart_products" DROP COLUMN "total_price"`);
        await queryRunner.query(`ALTER TABLE "cart_products" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "cart_products" ADD "note" character varying`);
        await queryRunner.query(`ALTER TABLE "flash_sales" ADD CONSTRAINT "FK_77d00a785e4876b50ff0c7857b4" FOREIGN KEY ("time_frame_id") REFERENCES "flash_sale_time_frames"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_products" ADD CONSTRAINT "FK_bb7910594db3f08cadeb6f484c1" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_product_options" ADD CONSTRAINT "FK_aa84e77d9b6d67dcf9d4a9d4912" FOREIGN KEY ("cart_product_id") REFERENCES "cart_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_product_options" ADD CONSTRAINT "FK_5bd050e9884f6f6e46328f8b74d" FOREIGN KEY ("option_id") REFERENCES "options"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_product_options" DROP CONSTRAINT "FK_5bd050e9884f6f6e46328f8b74d"`);
        await queryRunner.query(`ALTER TABLE "cart_product_options" DROP CONSTRAINT "FK_aa84e77d9b6d67dcf9d4a9d4912"`);
        await queryRunner.query(`ALTER TABLE "cart_products" DROP CONSTRAINT "FK_bb7910594db3f08cadeb6f484c1"`);
        await queryRunner.query(`ALTER TABLE "flash_sales" DROP CONSTRAINT "FK_77d00a785e4876b50ff0c7857b4"`);
        await queryRunner.query(`ALTER TABLE "cart_products" DROP COLUMN "note"`);
        await queryRunner.query(`ALTER TABLE "cart_products" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart_products" ADD "total_price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart_products" ADD "unit_price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "flash_sales" ADD "timeFrameId" integer`);
        await queryRunner.query(`DROP TABLE "cart_product_options"`);
        await queryRunner.query(`ALTER TABLE "flash_sales" ADD CONSTRAINT "FK_509f77d8450623f2ab437d003dc" FOREIGN KEY ("timeFrameId") REFERENCES "flash_sale_time_frames"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
