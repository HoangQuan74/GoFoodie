import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterVouchersTable1740474102425 implements MigrationInterface {
    name = 'AlterVouchersTable1740474102425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vouchers" ADD "created_by_store_id" integer`);
        await queryRunner.query(`ALTER TABLE "flash_sales" ADD "created_by_store_id" integer`);
        await queryRunner.query(`ALTER TABLE "vouchers" DROP CONSTRAINT "FK_15a3076888af32b92199483f809"`);
        await queryRunner.query(`ALTER TABLE "vouchers" ALTER COLUMN "created_by_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD CONSTRAINT "FK_15a3076888af32b92199483f809" FOREIGN KEY ("created_by_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vouchers" DROP CONSTRAINT "FK_15a3076888af32b92199483f809"`);
        await queryRunner.query(`ALTER TABLE "vouchers" ALTER COLUMN "created_by_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD CONSTRAINT "FK_15a3076888af32b92199483f809" FOREIGN KEY ("created_by_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flash_sales" DROP COLUMN "created_by_store_id"`);
        await queryRunner.query(`ALTER TABLE "vouchers" DROP COLUMN "created_by_store_id"`);
    }

}
