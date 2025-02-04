import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateReviewTemplatesTable1738663967515 implements MigrationInterface {
    name = 'CreateReviewTemplatesTable1738663967515'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."review_templates_type_enum" AS ENUM('client', 'merchant', 'driver')`);
        await queryRunner.query(`CREATE TABLE "review_templates" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."review_templates_type_enum" NOT NULL, "name" character varying NOT NULL, "is_five_star" boolean NOT NULL, "is_active" boolean NOT NULL, CONSTRAINT "PK_1efdfa46a67617abec3b858a4ac" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "review_templates"`);
        await queryRunner.query(`DROP TYPE "public"."review_templates_type_enum"`);
    }

}
