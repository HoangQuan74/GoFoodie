import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrdersTable1737107619156 implements MigrationInterface {
    name = 'CreateOrdersTable1737107619156'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'confirmed', 'in_delivery', 'delivered', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_paymentstatus_enum" AS ENUM('unpaid', 'paid', 'refunded')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "client_id" integer NOT NULL, "store_id" integer NOT NULL, "driver_id" integer, "totalAmount" numeric(10,2) NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending', "paymentStatus" "public"."orders_paymentstatus_enum" NOT NULL DEFAULT 'unpaid', "deliveryAddress" character varying, "deliveryLatitude" double precision, "deliveryLongitude" double precision, "notes" character varying, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" SERIAL NOT NULL, "order_id" integer NOT NULL, "product_id" integer NOT NULL, "productName" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "quantity" integer NOT NULL, "subtotal" numeric(10,2) NOT NULL, "note" character varying, "options" json, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "fcm_histories" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "user_type" character varying NOT NULL, "title" character varying NOT NULL, "body" character varying NOT NULL, "is_success" boolean, "sent_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_57dab927682e360931e975a2648" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_505ba3689ef2763acd6c4fc93a4" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_b7a7bb813431fc7cd73cced0001" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_222cd7bf166a2d7a6aad9cdebee" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_222cd7bf166a2d7a6aad9cdebee"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_b7a7bb813431fc7cd73cced0001"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_505ba3689ef2763acd6c4fc93a4"`);
        await queryRunner.query(`DROP TABLE "fcm_histories"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_paymentstatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    }

}
