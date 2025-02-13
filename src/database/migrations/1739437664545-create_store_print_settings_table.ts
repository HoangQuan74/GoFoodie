import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStorePrintSettingsTable1739437664545 implements MigrationInterface {
    name = 'CreateStorePrintSettingsTable1739437664545'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."store_print_settings_print_type_enum" AS ENUM('customer', 'store')`);
        await queryRunner.query(`CREATE TYPE "public"."store_print_settings_confirm_types_enum" AS ENUM('auto_receive', 'store_receive')`);
        await queryRunner.query(`CREATE TABLE "store_print_settings" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "store_id" integer NOT NULL, "auto_print" boolean NOT NULL DEFAULT false, "print_type" "public"."store_print_settings_print_type_enum" NOT NULL, "confirm_types" "public"."store_print_settings_confirm_types_enum" array NOT NULL, CONSTRAINT "PK_906b3841ce8c67dffd3f51213f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "auto_accept_order" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "store_print_settings" ADD CONSTRAINT "FK_236d96806f2cc65f112fdeadd94" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_print_settings" DROP CONSTRAINT "FK_236d96806f2cc65f112fdeadd94"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "auto_accept_order"`);
        await queryRunner.query(`DROP TABLE "store_print_settings"`);
        await queryRunner.query(`DROP TYPE "public"."store_print_settings_confirm_types_enum"`);
        await queryRunner.query(`DROP TYPE "public"."store_print_settings_print_type_enum"`);
    }

}
