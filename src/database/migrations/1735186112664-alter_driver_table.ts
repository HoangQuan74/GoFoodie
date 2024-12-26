import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDriverTable1735186112664 implements MigrationInterface {
    name = 'AlterDriverTable1735186112664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD "uniform_image_id" uuid`);
        await queryRunner.query(`ALTER TABLE "banners" ADD "isActive" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TYPE "public"."driver_uniforms_status_enum" RENAME TO "driver_uniforms_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."driver_uniforms_status_enum" AS ENUM('ordered', 'received')`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ALTER COLUMN "status" TYPE "public"."driver_uniforms_status_enum" USING "status"::"text"::"public"."driver_uniforms_status_enum"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ALTER COLUMN "status" SET DEFAULT 'ordered'`);
        await queryRunner.query(`DROP TYPE "public"."driver_uniforms_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD CONSTRAINT "FK_34e197c371e3c1a228edf835e8d" FOREIGN KEY ("uniform_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP CONSTRAINT "FK_34e197c371e3c1a228edf835e8d"`);
        await queryRunner.query(`CREATE TYPE "public"."driver_uniforms_status_enum_old" AS ENUM('ordered')`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ALTER COLUMN "status" TYPE "public"."driver_uniforms_status_enum_old" USING "status"::"text"::"public"."driver_uniforms_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ALTER COLUMN "status" SET DEFAULT 'ordered'`);
        await queryRunner.query(`DROP TYPE "public"."driver_uniforms_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."driver_uniforms_status_enum_old" RENAME TO "driver_uniforms_status_enum"`);
        await queryRunner.query(`ALTER TABLE "banners" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP COLUMN "uniform_image_id"`);
    }

}
