import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreTable1738594820759 implements MigrationInterface {
    name = 'AlterStoreTable1738594820759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP CONSTRAINT "FK_bac1db61b1363209e954bbdf55b"`);
        await queryRunner.query(`ALTER TABLE "client_addresses" DROP CONSTRAINT "FK_a88557f9d4f0eebd10e1c46af73"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "preparation_time" integer NOT NULL DEFAULT '20'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "total_quantity" bigint`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "promo_price" numeric(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "estimated_pickup_time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "estimated_delivery_time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "product_categories" ALTER COLUMN "code" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "product_categories_code_seq"`);
        await queryRunner.query(`ALTER TABLE "product_categories" ALTER COLUMN "code" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD CONSTRAINT "FK_bac1db61b1363209e954bbdf55b" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_addresses" ADD CONSTRAINT "FK_a88557f9d4f0eebd10e1c46af73" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_addresses" DROP CONSTRAINT "FK_a88557f9d4f0eebd10e1c46af73"`);
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP CONSTRAINT "FK_bac1db61b1363209e954bbdf55b"`);
        await queryRunner.query(`ALTER TABLE "product_categories" ALTER COLUMN "code" DROP DEFAULT`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "product_categories_code_seq" OWNED BY "product_categories"."code"`);
        await queryRunner.query(`ALTER TABLE "product_categories" ALTER COLUMN "code" SET DEFAULT nextval('"product_categories_code_seq"')`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "estimated_delivery_time"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "estimated_pickup_time"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "promo_price"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total_quantity"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "preparation_time"`);
        await queryRunner.query(`ALTER TABLE "client_addresses" ADD CONSTRAINT "FK_a88557f9d4f0eebd10e1c46af73" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD CONSTRAINT "FK_bac1db61b1363209e954bbdf55b" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
