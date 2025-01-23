import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterRequestTypesTable1737602839825 implements MigrationInterface {
    name = 'AlterRequestTypesTable1737602839825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_types" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "request_types" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "request_types" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "request_types" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "request_types" ADD "app_type_id" character varying NOT NULL DEFAULT 'app_client'`);
        await queryRunner.query(`ALTER TABLE "request_types" ADD "created_by_id" integer`);
        await queryRunner.query(`ALTER TABLE "request_types" ADD CONSTRAINT "FK_5c113e4a1539601a12c94180f39" FOREIGN KEY ("created_by_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request_types" ADD CONSTRAINT "FK_b9fffec0cda924177ef29fa3a05" FOREIGN KEY ("app_type_id") REFERENCES "app_types"("value") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_types" DROP CONSTRAINT "FK_b9fffec0cda924177ef29fa3a05"`);
        await queryRunner.query(`ALTER TABLE "request_types" DROP CONSTRAINT "FK_5c113e4a1539601a12c94180f39"`);
        await queryRunner.query(`ALTER TABLE "request_types" DROP COLUMN "created_by_id"`);
        await queryRunner.query(`ALTER TABLE "request_types" DROP COLUMN "app_type_id"`);
        await queryRunner.query(`ALTER TABLE "request_types" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "request_types" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "request_types" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "request_types" DROP COLUMN "created_at"`);
    }

}
