import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterOrderItemsTable1737510828058 implements MigrationInterface {
    name = 'AlterOrderItemsTable1737510828058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."order_activities_status_enum" RENAME TO "order_activities_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."order_activities_status_enum" AS ENUM('pending', 'confirmed', 'in_delivery', 'delivered', 'cancelled', 'offer_sent_to_driver', 'driver_accepted', 'searching_for_driver')`);
        await queryRunner.query(`ALTER TABLE "order_activities" ALTER COLUMN "status" TYPE "public"."order_activities_status_enum" USING "status"::"text"::"public"."order_activities_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."order_activities_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."orders_status_enum" RENAME TO "orders_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'confirmed', 'in_delivery', 'delivered', 'cancelled', 'offer_sent_to_driver', 'driver_accepted', 'searching_for_driver')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."orders_status_enum" USING "status"::"text"::"public"."orders_status_enum"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum_old" AS ENUM('pending', 'confirmed', 'in_delivery', 'delivered', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."orders_status_enum_old" USING "status"::"text"::"public"."orders_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."orders_status_enum_old" RENAME TO "orders_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."order_activities_status_enum_old" AS ENUM('pending', 'confirmed', 'in_delivery', 'delivered', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "order_activities" ALTER COLUMN "status" TYPE "public"."order_activities_status_enum_old" USING "status"::"text"::"public"."order_activities_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."order_activities_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."order_activities_status_enum_old" RENAME TO "order_activities_status_enum"`);
    }

}
