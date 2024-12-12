import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterRolesTable1733988259550 implements MigrationInterface {
    name = 'AlterRolesTable1733988259550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles_operations" ("role_id" integer NOT NULL, "operation_id" integer NOT NULL, CONSTRAINT "PK_653827ea3e0eb2c3e8369b557d7" PRIMARY KEY ("role_id", "operation_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dc0af9f96c7a0d783c3b28a284" ON "roles_operations" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d6d84e6c3a93841f39830f0862" ON "roles_operations" ("operation_id") `);
        await queryRunner.query(`ALTER TABLE "admins" ADD "role_id" integer`);
        await queryRunner.query(`ALTER TABLE "admins" ADD CONSTRAINT "FK_5733c73cd81c566a90cc4802f96" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles_operations" ADD CONSTRAINT "FK_dc0af9f96c7a0d783c3b28a2848" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_operations" ADD CONSTRAINT "FK_d6d84e6c3a93841f39830f08622" FOREIGN KEY ("operation_id") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles_operations" DROP CONSTRAINT "FK_d6d84e6c3a93841f39830f08622"`);
        await queryRunner.query(`ALTER TABLE "roles_operations" DROP CONSTRAINT "FK_dc0af9f96c7a0d783c3b28a2848"`);
        await queryRunner.query(`ALTER TABLE "admins" DROP CONSTRAINT "FK_5733c73cd81c566a90cc4802f96"`);
        await queryRunner.query(`ALTER TABLE "admins" DROP COLUMN "role_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d6d84e6c3a93841f39830f0862"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dc0af9f96c7a0d783c3b28a284"`);
        await queryRunner.query(`DROP TABLE "roles_operations"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
