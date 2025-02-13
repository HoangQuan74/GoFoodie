import { MigrationInterface, QueryRunner } from "typeorm";

export class FixMigration1739423278958 implements MigrationInterface {
    name = 'FixMigration1739423278958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP CONSTRAINT "FK_bac1db61b1363209e954bbdf55b"`);
        await queryRunner.query(`ALTER TABLE "client_addresses" DROP CONSTRAINT "FK_a88557f9d4f0eebd10e1c46af73"`);
        await queryRunner.query(`ALTER TYPE "public"."order_activities_status_enum" RENAME TO "order_activities_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."order_activities_status_enum" AS ENUM('order_created', 'pending', 'confirmed', 'searching_for_driver', 'offer_sent_to_driver', 'driver_accepted', 'in_delivery', 'delivered', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "order_activities" ALTER COLUMN "status" TYPE "public"."order_activities_status_enum" USING "status"::"text"::"public"."order_activities_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."order_activities_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."orders_status_enum" RENAME TO "orders_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('order_created', 'pending', 'confirmed', 'searching_for_driver', 'offer_sent_to_driver', 'driver_accepted', 'in_delivery', 'delivered', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."orders_status_enum" USING "status"::"text"::"public"."orders_status_enum"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD CONSTRAINT "FK_bac1db61b1363209e954bbdf55b" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_addresses" ADD CONSTRAINT "FK_a88557f9d4f0eebd10e1c46af73" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_addresses" DROP CONSTRAINT "FK_a88557f9d4f0eebd10e1c46af73"`);
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP CONSTRAINT "FK_bac1db61b1363209e954bbdf55b"`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum_old" AS ENUM('pending', 'confirmed', 'in_delivery', 'delivered', 'cancelled', 'offer_sent_to_driver', 'driver_accepted', 'searching_for_driver')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."orders_status_enum_old" USING "status"::"text"::"public"."orders_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."orders_status_enum_old" RENAME TO "orders_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."order_activities_status_enum_old" AS ENUM('pending', 'confirmed', 'in_delivery', 'delivered', 'cancelled', 'offer_sent_to_driver', 'driver_accepted', 'searching_for_driver')`);
        await queryRunner.query(`ALTER TABLE "order_activities" ALTER COLUMN "status" TYPE "public"."order_activities_status_enum_old" USING "status"::"text"::"public"."order_activities_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."order_activities_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."order_activities_status_enum_old" RENAME TO "order_activities_status_enum"`);
        await queryRunner.query(`ALTER TABLE "client_addresses" ADD CONSTRAINT "FK_a88557f9d4f0eebd10e1c46af73" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD CONSTRAINT "FK_bac1db61b1363209e954bbdf55b" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
