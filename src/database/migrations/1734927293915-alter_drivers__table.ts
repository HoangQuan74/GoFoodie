import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDrivers_table1734927293915 implements MigrationInterface {
    name = 'AlterDrivers_table1734927293915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "avatar" uuid`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "identity_card_front_id"`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "identity_card_front_id" uuid`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "identity_card_back_id"`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "identity_card_back_id" uuid`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD CONSTRAINT "FK_ab3df3fad9cc6b0fc76d36d8fa7" FOREIGN KEY ("identity_card_front_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD CONSTRAINT "FK_ff88aaa203a49644022f130f7d8" FOREIGN KEY ("identity_card_back_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD CONSTRAINT "FK_287a4413e5ec3546869983ad43e" FOREIGN KEY ("avatar") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "FK_287a4413e5ec3546869983ad43e"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "FK_ff88aaa203a49644022f130f7d8"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "FK_ab3df3fad9cc6b0fc76d36d8fa7"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "identity_card_back_id"`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "identity_card_back_id" character varying`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "identity_card_front_id"`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "identity_card_front_id" character varying`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "avatar" character varying`);
    }

}
