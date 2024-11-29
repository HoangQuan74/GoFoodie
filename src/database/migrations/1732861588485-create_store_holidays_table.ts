import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStoreHolidaysTable1732861588485 implements MigrationInterface {
    name = 'CreateStoreHolidaysTable1732861588485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "store_special_working_time" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "store_id" integer NOT NULL, "date" date NOT NULL, "open_time" integer NOT NULL, "close_time" integer NOT NULL, CONSTRAINT "PK_e91de1206e36e3468606b698102" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "store_holidays" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "store_id" integer NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, CONSTRAINT "PK_2bb68b28111a6e12940ae19e746" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."merchants_role_enum" AS ENUM('owner', 'manager', 'staff')`);
        await queryRunner.query(`ALTER TABLE "merchants" ADD "role" "public"."merchants_role_enum" NOT NULL DEFAULT 'owner'`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "is_pause" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "is_special_working_time" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "store_special_working_time" ADD CONSTRAINT "FK_67403f219e66da4928d168d5c1c" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_holidays" ADD CONSTRAINT "FK_64cae3869e80ac6b4efd133deb1" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_holidays" DROP CONSTRAINT "FK_64cae3869e80ac6b4efd133deb1"`);
        await queryRunner.query(`ALTER TABLE "store_special_working_time" DROP CONSTRAINT "FK_67403f219e66da4928d168d5c1c"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "is_special_working_time"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "is_pause"`);
        await queryRunner.query(`ALTER TABLE "merchants" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."merchants_role_enum"`);
        await queryRunner.query(`DROP TABLE "store_holidays"`);
        await queryRunner.query(`DROP TABLE "store_special_working_time"`);
    }

}
