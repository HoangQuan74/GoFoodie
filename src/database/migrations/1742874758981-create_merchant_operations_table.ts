import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMerchantOperationsTable1742874758981 implements MigrationInterface {
    name = 'CreateMerchantOperationsTable1742874758981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "merchant_roles" ("code" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_3066243a3a5a9b5b5eb5da4c217" PRIMARY KEY ("code"))`);
        await queryRunner.query(`CREATE TABLE "merchant_operations" ("code" character varying NOT NULL, "group_id" integer NOT NULL, "group_name" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_a57c9e7a4bc2c598f9803e64f59" PRIMARY KEY ("code"))`);
        await queryRunner.query(`CREATE TABLE "merchant_role_operations" ("operation_code" character varying NOT NULL, "role_code" character varying NOT NULL, CONSTRAINT "PK_db662a15aa77b73726e37b7152f" PRIMARY KEY ("operation_code", "role_code"))`);
        await queryRunner.query(`CREATE INDEX "IDX_251d16d453c222ccff113cc8b8" ON "merchant_role_operations" ("operation_code") `);
        await queryRunner.query(`CREATE INDEX "IDX_1b372e6b86cda5c6c65080ed92" ON "merchant_role_operations" ("role_code") `);
        await queryRunner.query(`ALTER TABLE "merchant_role_operations" ADD CONSTRAINT "FK_251d16d453c222ccff113cc8b83" FOREIGN KEY ("operation_code") REFERENCES "merchant_operations"("code") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "merchant_role_operations" ADD CONSTRAINT "FK_1b372e6b86cda5c6c65080ed92e" FOREIGN KEY ("role_code") REFERENCES "merchant_roles"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchant_role_operations" DROP CONSTRAINT "FK_1b372e6b86cda5c6c65080ed92e"`);
        await queryRunner.query(`ALTER TABLE "merchant_role_operations" DROP CONSTRAINT "FK_251d16d453c222ccff113cc8b83"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1b372e6b86cda5c6c65080ed92"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_251d16d453c222ccff113cc8b8"`);
        await queryRunner.query(`DROP TABLE "merchant_role_operations"`);
        await queryRunner.query(`DROP TABLE "merchant_operations"`);
        await queryRunner.query(`DROP TABLE "merchant_roles"`);
    }

}
