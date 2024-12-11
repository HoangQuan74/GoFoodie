import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMerchantRefreshTokensTable1733888938000 implements MigrationInterface {
    name = 'CreateMerchantRefreshTokensTable1733888938000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drivers" RENAME COLUMN "approvalStatus" TO "approval_status"`);
        await queryRunner.query(`CREATE TABLE "merchant_refresh_tokens" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "merchant_id" integer NOT NULL, "token" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "device_token" character varying NOT NULL, "is_revoked" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_ca22f93b850555ea687353603a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "merchant_refresh_tokens" ADD CONSTRAINT "FK_76b7f73d3c8469ba3465fae2fb8" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_banks" ADD CONSTRAINT "FK_e868c9b50902c1982a78fba86bd" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_banks" ADD CONSTRAINT "FK_dc3a573b6aa1190522b26e30027" FOREIGN KEY ("bank_branch_id") REFERENCES "bank_branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_banks" DROP CONSTRAINT "FK_dc3a573b6aa1190522b26e30027"`);
        await queryRunner.query(`ALTER TABLE "driver_banks" DROP CONSTRAINT "FK_e868c9b50902c1982a78fba86bd"`);
        await queryRunner.query(`ALTER TABLE "merchant_refresh_tokens" DROP CONSTRAINT "FK_76b7f73d3c8469ba3465fae2fb8"`);
        await queryRunner.query(`DROP TABLE "merchant_refresh_tokens"`);
        await queryRunner.query(`ALTER TABLE "drivers" RENAME COLUMN "approval_status" TO "approvalStatus"`);
    }

}
