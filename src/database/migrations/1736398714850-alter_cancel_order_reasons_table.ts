import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterCancelOrderReasonsTable1736398714850 implements MigrationInterface {
    name = 'AlterCancelOrderReasonsTable1736398714850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_criteria_type_enum" AS ENUM('distance', 'time')`);
        await queryRunner.query(`CREATE TABLE "order_criteria" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."order_criteria_type_enum" NOT NULL, "value" integer NOT NULL, "priority" integer NOT NULL, "service_type_id" integer NOT NULL, CONSTRAINT "PK_da2d514315a77f759caa6a59bb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cancel_order_reasons" ADD "status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "order_criteria" ADD CONSTRAINT "FK_d21ae24d2cb63228067352d5c40" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_criteria" DROP CONSTRAINT "FK_d21ae24d2cb63228067352d5c40"`);
        await queryRunner.query(`ALTER TABLE "cancel_order_reasons" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TABLE "order_criteria"`);
        await queryRunner.query(`DROP TYPE "public"."order_criteria_type_enum"`);
    }

}
