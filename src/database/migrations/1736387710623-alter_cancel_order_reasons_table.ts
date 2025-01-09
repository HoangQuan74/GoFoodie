import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterCancelOrderReasonsTable1736387710623 implements MigrationInterface {
    name = 'AlterCancelOrderReasonsTable1736387710623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cancel_order_reasons" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_6d52de41a46f623866609a61e7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cancel_order_reason_app_types" ("cancelOrderReasonsId" integer NOT NULL, "appTypesValue" character varying NOT NULL, CONSTRAINT "PK_c6f8825ac2cfab300c9fd782326" PRIMARY KEY ("cancelOrderReasonsId", "appTypesValue"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4a5c4a90543d3e3b6a2fb93eb4" ON "cancel_order_reason_app_types" ("cancelOrderReasonsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_47e4c06493ccb67cffb0566837" ON "cancel_order_reason_app_types" ("appTypesValue") `);
        await queryRunner.query(`ALTER TABLE "cancel_order_reason_app_types" ADD CONSTRAINT "FK_4a5c4a90543d3e3b6a2fb93eb41" FOREIGN KEY ("cancelOrderReasonsId") REFERENCES "cancel_order_reasons"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "cancel_order_reason_app_types" ADD CONSTRAINT "FK_47e4c06493ccb67cffb0566837c" FOREIGN KEY ("appTypesValue") REFERENCES "app_types"("value") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cancel_order_reason_app_types" DROP CONSTRAINT "FK_47e4c06493ccb67cffb0566837c"`);
        await queryRunner.query(`ALTER TABLE "cancel_order_reason_app_types" DROP CONSTRAINT "FK_4a5c4a90543d3e3b6a2fb93eb41"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_47e4c06493ccb67cffb0566837"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4a5c4a90543d3e3b6a2fb93eb4"`);
        await queryRunner.query(`DROP TABLE "cancel_order_reason_app_types"`);
        await queryRunner.query(`DROP TABLE "cancel_order_reasons"`);
    }

}
