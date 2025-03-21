import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreNotificationsTable1742519939201 implements MigrationInterface {
    name = 'AlterStoreNotificationsTable1742519939201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."store_notifications_status_enum" AS ENUM('error', 'info')`);
        await queryRunner.query(`ALTER TABLE "store_notifications" ADD "status" "public"."store_notifications_status_enum" NOT NULL DEFAULT 'info'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_notifications" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."store_notifications_status_enum"`);
    }

}
