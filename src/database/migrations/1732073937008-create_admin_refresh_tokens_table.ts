import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAdminRefreshTokensTable1732073937008 implements MigrationInterface {
    name = 'CreateAdminRefreshTokensTable1732073937008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin_refresh_tokens" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "admin_id" integer NOT NULL, "token" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "is_revoked" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_341c4a1fa29fa0017ed8ad0791f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "admin_refresh_tokens" ADD CONSTRAINT "FK_1bd01666a593d39ddf07f011405" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_refresh_tokens" DROP CONSTRAINT "FK_1bd01666a593d39ddf07f011405"`);
        await queryRunner.query(`DROP TABLE "admin_refresh_tokens"`);
    }

}
