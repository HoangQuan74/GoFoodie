import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAdminNotificationsTable1739184759024 implements MigrationInterface {
    name = 'CreateAdminNotificationsTable1739184759024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_notifications" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "admin_notifications" ADD "from" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."admin_notifications_user_type_enum" AS ENUM('client', 'merchant', 'driver')`);
        await queryRunner.query(`ALTER TABLE "admin_notifications" ADD "user_type" "public"."admin_notifications_user_type_enum" NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."admin_notifications_related_type_enum" AS ENUM('store', 'driver', 'product')`);
        await queryRunner.query(`ALTER TABLE "admin_notifications" ADD "related_type" "public"."admin_notifications_related_type_enum"`);
        await queryRunner.query(`ALTER TABLE "admin_notifications" ADD "related_id" integer`);
        await queryRunner.query(`ALTER TABLE "admin_notifications" ADD "province_id" integer`);
        await queryRunner.query(`ALTER TABLE "admin_notifications" ADD "read_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "admin_notifications" ADD CONSTRAINT "FK_47a1f892ce641ca40d748f4dee2" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_notifications" DROP CONSTRAINT "FK_47a1f892ce641ca40d748f4dee2"`);
        await queryRunner.query(`ALTER TABLE "admin_notifications" DROP COLUMN "read_at"`);
        await queryRunner.query(`ALTER TABLE "admin_notifications" DROP COLUMN "province_id"`);
        await queryRunner.query(`ALTER TABLE "admin_notifications" DROP COLUMN "related_id"`);
        await queryRunner.query(`ALTER TABLE "admin_notifications" DROP COLUMN "related_type"`);
        await queryRunner.query(`DROP TYPE "public"."admin_notifications_related_type_enum"`);
        await queryRunner.query(`ALTER TABLE "admin_notifications" DROP COLUMN "user_type"`);
        await queryRunner.query(`DROP TYPE "public"."admin_notifications_user_type_enum"`);
        await queryRunner.query(`ALTER TABLE "admin_notifications" DROP COLUMN "from"`);
        await queryRunner.query(`ALTER TABLE "admin_notifications" ADD "title" character varying NOT NULL`);
    }

}
