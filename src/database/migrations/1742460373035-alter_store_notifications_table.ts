import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreNotificationsTable1742460373035 implements MigrationInterface {
    name = 'AlterStoreNotificationsTable1742460373035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."store_notifications_type_enum" RENAME TO "store_notifications_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."store_notifications_type_enum" AS ENUM('order', 'promotion', 'news', 'store_update', 'wallet')`);
        await queryRunner.query(`ALTER TABLE "store_notifications" ALTER COLUMN "type" TYPE "public"."store_notifications_type_enum" USING "type"::"text"::"public"."store_notifications_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."store_notifications_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."store_notifications_type_enum_old" AS ENUM('news', 'order', 'promotion', 'store_update')`);
        await queryRunner.query(`ALTER TABLE "store_notifications" ALTER COLUMN "type" TYPE "public"."store_notifications_type_enum_old" USING "type"::"text"::"public"."store_notifications_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."store_notifications_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."store_notifications_type_enum_old" RENAME TO "store_notifications_type_enum"`);
    }

}
