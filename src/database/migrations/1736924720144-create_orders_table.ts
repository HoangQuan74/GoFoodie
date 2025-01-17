import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrdersTable1736924720145 implements MigrationInterface {
  name = 'CreateOrdersTable1736924720145';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'confirmed', 'in_delivery', 'delivered', 'cancelled')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."orders_payment_status_enum" AS ENUM('unpaid', 'paid', 'refunded')
    `);
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" SERIAL NOT NULL,
        "client_id" integer NOT NULL,
        "store_id" integer NOT NULL,
        "driver_id" integer,
        "total_amount" numeric(10,2) NOT NULL,
        "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending',
        "payment_status" "public"."orders_payment_status_enum" NOT NULL DEFAULT 'unpaid',
        "delivery_address" character varying,
        "delivery_latitude" real,
        "delivery_longitude" real,
        "notes" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "orders" 
      ADD CONSTRAINT "FK_orders_client_id" 
      FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "orders" 
      ADD CONSTRAINT "FK_orders_store_id" 
      FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "orders" 
      ADD CONSTRAINT "FK_orders_driver_id" 
      FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_orders_driver_id"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_orders_store_id"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_orders_client_id"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_payment_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
  }
}
