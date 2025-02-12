import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAdminNotificationsTable1739326067003 implements MigrationInterface {
    name = 'AlterAdminNotificationsTable1739326067003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."admin_notifications_type_enum" AS ENUM('store_create', 'driver_create', 'product_create', 'product_update')`);
        await queryRunner.query(`ALTER TABLE "admin_notifications" ADD "type" "public"."admin_notifications_type_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_notifications" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."admin_notifications_type_enum"`);
    }

}
