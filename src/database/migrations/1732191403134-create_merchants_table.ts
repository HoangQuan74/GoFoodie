import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMerchantsTable1732191403134 implements MigrationInterface {
    name = 'CreateMerchantsTable1732191403134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."merchants_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "merchants" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "phone" character varying, "email" character varying, "password" character varying, "email_verified_at" TIMESTAMP, "status" "public"."merchants_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "PK_4fd312ef25f8e05ad47bfe7ed25" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "merchants"`);
        await queryRunner.query(`DROP TYPE "public"."merchants_status_enum"`);
    }

}
