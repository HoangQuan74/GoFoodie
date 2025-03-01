import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterClientNotificationsTable1740746411310 implements MigrationInterface {
    name = 'AlterClientNotificationsTable1740746411310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."client_notifications_status_enum" AS ENUM('error', 'info')`);
        await queryRunner.query(`ALTER TABLE "client_notifications" ADD "status" "public"."client_notifications_status_enum" NOT NULL DEFAULT 'info'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_notifications" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."client_notifications_status_enum"`);
    }

}
