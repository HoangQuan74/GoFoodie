import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDriversTable1733717786455 implements MigrationInterface {
    name = 'AlterDriversTable1733717786455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_banks" DROP COLUMN "bank_account_number"`);
        await queryRunner.query(`ALTER TABLE "driver_banks" DROP COLUMN "bank_account_name"`);
        await queryRunner.query(`ALTER TABLE "driver_banks" ADD "account_number" character varying`);
        await queryRunner.query(`ALTER TABLE "driver_banks" ADD "account_name" character varying`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "approved_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "approved_by_id" integer`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "approved_note" character varying`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "created_by_id" integer`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD CONSTRAINT "FK_d61d382427e101f846aa8209e04" FOREIGN KEY ("approved_by_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD CONSTRAINT "FK_6c8ea6f6ff0e5589db2090db5c8" FOREIGN KEY ("created_by_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "FK_6c8ea6f6ff0e5589db2090db5c8"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "FK_d61d382427e101f846aa8209e04"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "created_by_id"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "approved_note"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "approved_by_id"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "approved_at"`);
        await queryRunner.query(`ALTER TABLE "driver_banks" DROP COLUMN "account_name"`);
        await queryRunner.query(`ALTER TABLE "driver_banks" DROP COLUMN "account_number"`);
        await queryRunner.query(`ALTER TABLE "driver_banks" ADD "bank_account_name" character varying`);
        await queryRunner.query(`ALTER TABLE "driver_banks" ADD "bank_account_number" character varying`);
    }

}
