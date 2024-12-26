import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOnlineTrainingsTable1735212397796 implements MigrationInterface {
    name = 'CreateOnlineTrainingsTable1735212397796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."online_training_type_enum" AS ENUM('video', 'image')`);
        await queryRunner.query(`CREATE TABLE "online_training" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "video_id" uuid, "title" character varying NOT NULL, "content" character varying NOT NULL, "type" "public"."online_training_type_enum" NOT NULL, "test_name" character varying NOT NULL, "test_link" character varying NOT NULL, "test_description" character varying NOT NULL, CONSTRAINT "PK_b7aa3362e3b39a7a63c00bcac29" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "online_training_images" ("online_training_id" integer NOT NULL, "image_id" uuid NOT NULL, CONSTRAINT "PK_6e780b470f7e9cf8bf8be6eb4d7" PRIMARY KEY ("online_training_id", "image_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5f2d3fb7cc416fb68a8e67ea9d" ON "online_training_images" ("online_training_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_473b5e2b97fa055e371149c9aa" ON "online_training_images" ("image_id") `);
        await queryRunner.query(`ALTER TABLE "online_training" ADD CONSTRAINT "FK_567286f77d18077ac6c688e0a60" FOREIGN KEY ("video_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "online_training_images" ADD CONSTRAINT "FK_5f2d3fb7cc416fb68a8e67ea9d8" FOREIGN KEY ("online_training_id") REFERENCES "online_training"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "online_training_images" ADD CONSTRAINT "FK_473b5e2b97fa055e371149c9aac" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "online_training_images" DROP CONSTRAINT "FK_473b5e2b97fa055e371149c9aac"`);
        await queryRunner.query(`ALTER TABLE "online_training_images" DROP CONSTRAINT "FK_5f2d3fb7cc416fb68a8e67ea9d8"`);
        await queryRunner.query(`ALTER TABLE "online_training" DROP CONSTRAINT "FK_567286f77d18077ac6c688e0a60"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_473b5e2b97fa055e371149c9aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5f2d3fb7cc416fb68a8e67ea9d"`);
        await queryRunner.query(`DROP TABLE "online_training_images"`);
        await queryRunner.query(`DROP TABLE "online_training"`);
        await queryRunner.query(`DROP TYPE "public"."online_training_type_enum"`);
    }

}
