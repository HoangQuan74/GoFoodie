import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoresTable1732802118269 implements MigrationInterface {
    name = 'AlterStoresTable1732802118269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_banks" DROP CONSTRAINT "FK_167853e650278d7e13a420b676c"`);
        await queryRunner.query(`ALTER TABLE "store_banks" DROP CONSTRAINT "FK_4000ebc5ae50ef601e78818db68"`);
        await queryRunner.query(`ALTER TABLE "store_banks" ALTER COLUMN "bank_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_banks" ALTER COLUMN "bank_branch_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_banks" ALTER COLUMN "bank_account_number" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_banks" ALTER COLUMN "bank_account_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_banks" ADD CONSTRAINT "FK_167853e650278d7e13a420b676c" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_banks" ADD CONSTRAINT "FK_4000ebc5ae50ef601e78818db68" FOREIGN KEY ("bank_branch_id") REFERENCES "bank_branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_banks" DROP CONSTRAINT "FK_4000ebc5ae50ef601e78818db68"`);
        await queryRunner.query(`ALTER TABLE "store_banks" DROP CONSTRAINT "FK_167853e650278d7e13a420b676c"`);
        await queryRunner.query(`ALTER TABLE "store_banks" ALTER COLUMN "bank_account_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_banks" ALTER COLUMN "bank_account_number" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_banks" ALTER COLUMN "bank_branch_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_banks" ALTER COLUMN "bank_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_banks" ADD CONSTRAINT "FK_4000ebc5ae50ef601e78818db68" FOREIGN KEY ("bank_branch_id") REFERENCES "bank_branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_banks" ADD CONSTRAINT "FK_167853e650278d7e13a420b676c" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
