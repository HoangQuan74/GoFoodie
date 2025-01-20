import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderActivitiesTable1737363348193 implements MigrationInterface {
    name = 'CreateOrderActivitiesTable1737363348193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_activities_status_enum" AS ENUM('pending', 'confirmed', 'in_delivery', 'delivered', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "order_activities" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order_id" integer NOT NULL, "status" "public"."order_activities_status_enum" NOT NULL, "description" character varying, "performed_by" character varying NOT NULL, "cancellation_reason" character varying, "cancellation_type" character varying, CONSTRAINT "PK_c05f685fcab38930d07cc87da9c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "client_cancellation_reason"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "merchant_cancellation_reason"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "driver_cancellation_reason"`);
        await queryRunner.query(`ALTER TABLE "order_activities" ADD CONSTRAINT "FK_da2a3bc733e7e5f6678820b8784" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_activities" DROP CONSTRAINT "FK_da2a3bc733e7e5f6678820b8784"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "driver_cancellation_reason" character varying`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "merchant_cancellation_reason" character varying`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "client_cancellation_reason" character varying`);
        await queryRunner.query(`DROP TABLE "order_activities"`);
        await queryRunner.query(`DROP TYPE "public"."order_activities_status_enum"`);
    }

}
