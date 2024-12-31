import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNoticesTable1735616983808 implements MigrationInterface {
    name = 'CreateNoticesTable1735616983808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notices_send_type_enum" AS ENUM('email', 'app')`);
        await queryRunner.query(`CREATE TABLE "notices" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "content" text NOT NULL, "notice_type_id" integer NOT NULL, "send_type" "public"."notices_send_type_enum" NOT NULL, "app_type" character varying NOT NULL, "send_now" boolean NOT NULL, "start_time" TIMESTAMP, "end_time" TIMESTAMP, "is_sent" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_3eb18c29da25d6935fcbe584237" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notice_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_18d70d0d5c02d30aadc936649af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notices" ADD CONSTRAINT "FK_dbb4c5cda61e6837fa131f7fad2" FOREIGN KEY ("notice_type_id") REFERENCES "notice_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notices" ADD CONSTRAINT "FK_ef3624cd9bc9d2698895db8e1de" FOREIGN KEY ("app_type") REFERENCES "app_types"("value") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notices" DROP CONSTRAINT "FK_ef3624cd9bc9d2698895db8e1de"`);
        await queryRunner.query(`ALTER TABLE "notices" DROP CONSTRAINT "FK_dbb4c5cda61e6837fa131f7fad2"`);
        await queryRunner.query(`DROP TABLE "notice_types"`);
        await queryRunner.query(`DROP TABLE "notices"`);
        await queryRunner.query(`DROP TYPE "public"."notices_send_type_enum"`);
    }

}
