import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreBanksTable1732727227054 implements MigrationInterface {
    name = 'AlterStoreBanksTable1732727227054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_banks" DROP COLUMN "bank_name"`);
        await queryRunner.query(`ALTER TABLE "store_banks" DROP COLUMN "bank_branch"`);
        await queryRunner.query(`ALTER TABLE "store_banks" ADD "bank_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_banks" ADD "bank_branch_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_banks" ADD CONSTRAINT "FK_167853e650278d7e13a420b676c" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_banks" ADD CONSTRAINT "FK_4000ebc5ae50ef601e78818db68" FOREIGN KEY ("bank_branch_id") REFERENCES "bank_branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_banks" DROP CONSTRAINT "FK_4000ebc5ae50ef601e78818db68"`);
        await queryRunner.query(`ALTER TABLE "store_banks" DROP CONSTRAINT "FK_167853e650278d7e13a420b676c"`);
        await queryRunner.query(`ALTER TABLE "store_banks" DROP COLUMN "bank_branch_id"`);
        await queryRunner.query(`ALTER TABLE "store_banks" DROP COLUMN "bank_id"`);
        await queryRunner.query(`ALTER TABLE "store_banks" ADD "bank_branch" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_banks" ADD "bank_name" character varying NOT NULL`);
    }

}
