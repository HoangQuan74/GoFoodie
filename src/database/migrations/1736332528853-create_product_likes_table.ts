import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductLikesTable1736332528853 implements MigrationInterface {
    name = 'CreateProductLikesTable1736332528853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "store_likes" ("store_id" integer NOT NULL, "client_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_62cf7e1faa3ffc2b895a9053b7c" PRIMARY KEY ("store_id", "client_id"))`);
        await queryRunner.query(`CREATE TABLE "product_likes" ("product_id" integer NOT NULL, "client_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4b78d3a8acee8fdbe805f15e762" PRIMARY KEY ("product_id", "client_id"))`);
        await queryRunner.query(`CREATE TABLE "cart_products" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "cart_id" integer NOT NULL, "product_id" integer NOT NULL, "name" character varying NOT NULL, "quantity" integer NOT NULL, "unit_price" integer NOT NULL, "total_price" integer NOT NULL, CONSTRAINT "PK_3b12299e401712e78753a7b4fec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "carts" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "client_id" integer NOT NULL, "store_id" integer NOT NULL, CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "store_likes" ADD CONSTRAINT "FK_75d008dfed902a47a1bc2199cbc" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_likes" ADD CONSTRAINT "FK_0ae6298be935c5e0f35a9ad2a57" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_likes" ADD CONSTRAINT "FK_7add69eb9dff06d1b36ce5fccdf" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_likes" ADD CONSTRAINT "FK_91230c928ef1d03e8fceb75977f" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_products" ADD CONSTRAINT "FK_ebc4fe8eabf38786bb86cda0b9f" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_e123c49ba6e8da0437583052b3d" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_40adab2d2921a344e92a3db449d" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_40adab2d2921a344e92a3db449d"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_e123c49ba6e8da0437583052b3d"`);
        await queryRunner.query(`ALTER TABLE "cart_products" DROP CONSTRAINT "FK_ebc4fe8eabf38786bb86cda0b9f"`);
        await queryRunner.query(`ALTER TABLE "product_likes" DROP CONSTRAINT "FK_91230c928ef1d03e8fceb75977f"`);
        await queryRunner.query(`ALTER TABLE "product_likes" DROP CONSTRAINT "FK_7add69eb9dff06d1b36ce5fccdf"`);
        await queryRunner.query(`ALTER TABLE "store_likes" DROP CONSTRAINT "FK_0ae6298be935c5e0f35a9ad2a57"`);
        await queryRunner.query(`ALTER TABLE "store_likes" DROP CONSTRAINT "FK_75d008dfed902a47a1bc2199cbc"`);
        await queryRunner.query(`DROP TABLE "carts"`);
        await queryRunner.query(`DROP TABLE "cart_products"`);
        await queryRunner.query(`DROP TABLE "product_likes"`);
        await queryRunner.query(`DROP TABLE "store_likes"`);
    }

}
