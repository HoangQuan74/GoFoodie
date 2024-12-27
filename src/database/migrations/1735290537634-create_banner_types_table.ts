import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBannerTypesTable1735290537634 implements MigrationInterface {
    name = 'CreateBannerTypesTable1735290537634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "app_types" ("value" character varying NOT NULL, "label" character varying NOT NULL, CONSTRAINT "PK_d5491ac6e369ae87a8eeb134e63" PRIMARY KEY ("value"))`);
        await queryRunner.query(`CREATE TABLE "banner_positions" ("value" character varying NOT NULL, "label" character varying NOT NULL, CONSTRAINT "PK_d4c7318288c5553c86121f3778e" PRIMARY KEY ("value"))`);
        await queryRunner.query(`CREATE TABLE "banner_types" ("value" character varying NOT NULL, "label" character varying NOT NULL, CONSTRAINT "PK_908b492ce6cb2c5ca1330ccef06" PRIMARY KEY ("value"))`);
        await queryRunner.query(`CREATE TABLE "app_type_banner_positions" ("app_type_id" character varying NOT NULL, "banner_position_id" character varying NOT NULL, CONSTRAINT "PK_f3bfdf97a8cf5ff26d6cddbe621" PRIMARY KEY ("app_type_id", "banner_position_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f6003c57d07baa76d2296470c2" ON "app_type_banner_positions" ("app_type_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3a801aabccaedf196bbd164495" ON "app_type_banner_positions" ("banner_position_id") `);
        await queryRunner.query(`CREATE TABLE "banner_type_banner_positions" ("banner_type_id" character varying NOT NULL, "banner_position_id" character varying NOT NULL, CONSTRAINT "PK_d65f4008ebe0144ea1164b303eb" PRIMARY KEY ("banner_type_id", "banner_position_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5656bf05a4ad403c9124bfab38" ON "banner_type_banner_positions" ("banner_type_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_646c8e566ecc3028c151f5326b" ON "banner_type_banner_positions" ("banner_position_id") `);
        await queryRunner.query(`ALTER TYPE "public"."banners_display_type_enum" RENAME TO "banners_display_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."banners_display_type_enum" AS ENUM('image', 'video', 'text', 'gif')`);
        await queryRunner.query(`ALTER TABLE "banners" ALTER COLUMN "display_type" TYPE "public"."banners_display_type_enum" USING "display_type"::"text"::"public"."banners_display_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."banners_display_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "app_type_banner_positions" ADD CONSTRAINT "FK_f6003c57d07baa76d2296470c2f" FOREIGN KEY ("app_type_id") REFERENCES "app_types"("value") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "app_type_banner_positions" ADD CONSTRAINT "FK_3a801aabccaedf196bbd1644951" FOREIGN KEY ("banner_position_id") REFERENCES "banner_positions"("value") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "banner_type_banner_positions" ADD CONSTRAINT "FK_5656bf05a4ad403c9124bfab38e" FOREIGN KEY ("banner_type_id") REFERENCES "banner_types"("value") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "banner_type_banner_positions" ADD CONSTRAINT "FK_646c8e566ecc3028c151f5326ba" FOREIGN KEY ("banner_position_id") REFERENCES "banner_positions"("value") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banner_type_banner_positions" DROP CONSTRAINT "FK_646c8e566ecc3028c151f5326ba"`);
        await queryRunner.query(`ALTER TABLE "banner_type_banner_positions" DROP CONSTRAINT "FK_5656bf05a4ad403c9124bfab38e"`);
        await queryRunner.query(`ALTER TABLE "app_type_banner_positions" DROP CONSTRAINT "FK_3a801aabccaedf196bbd1644951"`);
        await queryRunner.query(`ALTER TABLE "app_type_banner_positions" DROP CONSTRAINT "FK_f6003c57d07baa76d2296470c2f"`);
        await queryRunner.query(`CREATE TYPE "public"."banners_display_type_enum_old" AS ENUM('image', 'video')`);
        await queryRunner.query(`ALTER TABLE "banners" ALTER COLUMN "display_type" TYPE "public"."banners_display_type_enum_old" USING "display_type"::"text"::"public"."banners_display_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."banners_display_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."banners_display_type_enum_old" RENAME TO "banners_display_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_646c8e566ecc3028c151f5326b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5656bf05a4ad403c9124bfab38"`);
        await queryRunner.query(`DROP TABLE "banner_type_banner_positions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3a801aabccaedf196bbd164495"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f6003c57d07baa76d2296470c2"`);
        await queryRunner.query(`DROP TABLE "app_type_banner_positions"`);
        await queryRunner.query(`DROP TABLE "banner_types"`);
        await queryRunner.query(`DROP TABLE "banner_positions"`);
        await queryRunner.query(`DROP TABLE "app_types"`);
    }

}
