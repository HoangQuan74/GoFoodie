import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterOrdersTable1737361201368 implements MigrationInterface {
    name = 'AlterOrdersTable1737361201368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "totalAmount"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "deliveryLongitude"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "deliveryLatitude"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "paymentStatus"`);
        await queryRunner.query(`DROP TYPE "public"."orders_paymentstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "deliveryAddress"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "total_amount" numeric(10,2)`);
        await queryRunner.query(`CREATE TYPE "public"."orders_payment_status_enum" AS ENUM('unpaid', 'paid', 'refunded')`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "payment_status" "public"."orders_payment_status_enum" NOT NULL DEFAULT 'unpaid'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "client_cancellation_reason" character varying`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "merchant_cancellation_reason" character varying`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "driver_cancellation_reason" character varying`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "delivery_address" character varying`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "delivery_latitude" double precision`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "delivery_longitude" double precision`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "cart_products" ADD CONSTRAINT "FK_ebc4fe8eabf38786bb86cda0b9f" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_products" DROP CONSTRAINT "FK_ebc4fe8eabf38786bb86cda0b9f"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivery_longitude"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivery_latitude"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivery_address"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "driver_cancellation_reason"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "merchant_cancellation_reason"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "client_cancellation_reason"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "payment_status"`);
        await queryRunner.query(`DROP TYPE "public"."orders_payment_status_enum"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total_amount"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "deliveryAddress" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."orders_paymentstatus_enum" AS ENUM('unpaid', 'paid', 'refunded')`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "paymentStatus" "public"."orders_paymentstatus_enum" NOT NULL DEFAULT 'unpaid'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "deliveryLatitude" double precision`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "deliveryLongitude" double precision`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "totalAmount" numeric(10,2) NOT NULL`);
    }

}
