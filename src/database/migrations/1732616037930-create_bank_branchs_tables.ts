import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBankBranchsTables1732616037930 implements MigrationInterface {
    name = 'CreateBankBranchsTables1732616037930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bank_branches" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "bank_id" integer NOT NULL, CONSTRAINT "PK_f45cd71d079adf173b3dbf0e9da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bank_branches" ADD CONSTRAINT "FK_09dcf64d678faf12fb7ea2b6cd9" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_branches" DROP CONSTRAINT "FK_09dcf64d678faf12fb7ea2b6cd9"`);
        await queryRunner.query(`DROP TABLE "bank_branches"`);
    }

}
