import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreCardsTable1742574850141 implements MigrationInterface {
    name = 'AlterStoreCardsTable1742574850141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_cards" RENAME COLUMN "bank_code" TO "bank_id"`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "pin" character varying`);
        await queryRunner.query(`ALTER TABLE "store_cards" DROP COLUMN "bank_id"`);
        await queryRunner.query(`ALTER TABLE "store_cards" ADD "bank_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_cards" ADD CONSTRAINT "FK_6f05f77493586a26037c0283369" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_cards" DROP CONSTRAINT "FK_6f05f77493586a26037c0283369"`);
        await queryRunner.query(`ALTER TABLE "store_cards" DROP COLUMN "bank_id"`);
        await queryRunner.query(`ALTER TABLE "store_cards" ADD "bank_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "pin"`);
        await queryRunner.query(`ALTER TABLE "store_cards" RENAME COLUMN "bank_id" TO "bank_code"`);
    }

}
