import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClientNotificationsTable1740555083762 implements MigrationInterface {
    name = 'CreateClientNotificationsTable1740555083762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."client_notifications_type_enum" AS ENUM('order', 'promotion')`);
        await queryRunner.query(`CREATE TABLE "client_notifications" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "image_id" uuid, "from" character varying, "title" character varying NOT NULL, "content" character varying NOT NULL, "client_id" integer NOT NULL, "type" "public"."client_notifications_type_enum" NOT NULL, "related_id" integer, "read_at" TIMESTAMP, CONSTRAINT "PK_d15028dd82aa5208ef1c42f8f72" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "client_notifications" ADD CONSTRAINT "FK_27f0716605415c9997a88533a4a" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_notifications" ADD CONSTRAINT "FK_e6237567de7d0eb5de4e7532fca" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_notifications" DROP CONSTRAINT "FK_e6237567de7d0eb5de4e7532fca"`);
        await queryRunner.query(`ALTER TABLE "client_notifications" DROP CONSTRAINT "FK_27f0716605415c9997a88533a4a"`);
        await queryRunner.query(`DROP TABLE "client_notifications"`);
        await queryRunner.query(`DROP TYPE "public"."client_notifications_type_enum"`);
    }

}
