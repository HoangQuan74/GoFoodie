import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterRequestTypesTable1737621286103 implements MigrationInterface {
    name = 'AlterRequestTypesTable1737621286103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_types" DROP CONSTRAINT "FK_b9fffec0cda924177ef29fa3a05"`);
        await queryRunner.query(`CREATE TABLE "app_request_types" ("request_type_id" integer NOT NULL, "app_type_id" character varying NOT NULL, CONSTRAINT "PK_858bb5c7c867720439d4d66767f" PRIMARY KEY ("request_type_id", "app_type_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bd78aa0c9c2fd17337c84df151" ON "app_request_types" ("request_type_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7cac4cd9db060d4166da450bb2" ON "app_request_types" ("app_type_id") `);
        await queryRunner.query(`ALTER TABLE "request_types" DROP COLUMN "app_type_id"`);
        await queryRunner.query(`ALTER TABLE "app_request_types" ADD CONSTRAINT "FK_bd78aa0c9c2fd17337c84df1513" FOREIGN KEY ("request_type_id") REFERENCES "request_types"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "app_request_types" ADD CONSTRAINT "FK_7cac4cd9db060d4166da450bb24" FOREIGN KEY ("app_type_id") REFERENCES "app_types"("value") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_request_types" DROP CONSTRAINT "FK_7cac4cd9db060d4166da450bb24"`);
        await queryRunner.query(`ALTER TABLE "app_request_types" DROP CONSTRAINT "FK_bd78aa0c9c2fd17337c84df1513"`);
        await queryRunner.query(`ALTER TABLE "request_types" ADD "app_type_id" character varying NOT NULL DEFAULT 'app_client'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7cac4cd9db060d4166da450bb2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bd78aa0c9c2fd17337c84df151"`);
        await queryRunner.query(`DROP TABLE "app_request_types"`);
        await queryRunner.query(`ALTER TABLE "request_types" ADD CONSTRAINT "FK_b9fffec0cda924177ef29fa3a05" FOREIGN KEY ("app_type_id") REFERENCES "app_types"("value") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
