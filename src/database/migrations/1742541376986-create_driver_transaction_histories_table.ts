import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDriverTransactionHistoriesTable1742541376986 implements MigrationInterface {
    name = 'CreateDriverTransactionHistoriesTable1742541376986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."driver_transaction_histories_status_enum" AS ENUM('pending', 'success', 'failed')`);
        await queryRunner.query(`CREATE TYPE "public"."driver_transaction_histories_type_enum" AS ENUM('deposit', 'withdraw', 'transfer', 'recharge_coin')`);
        await queryRunner.query(`CREATE TYPE "public"."driver_transaction_histories_method_enum" AS ENUM('COLLECTION', 'ATM_CARD', 'CREDIT_CARD', 'WALLET')`);
        await queryRunner.query(`CREATE TABLE "driver_transaction_histories" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "driver_id" integer NOT NULL, "amount" bigint NOT NULL, "balance" bigint NOT NULL, "status" "public"."driver_transaction_histories_status_enum" NOT NULL DEFAULT 'pending', "type" "public"."driver_transaction_histories_type_enum" NOT NULL, "fee" bigint NOT NULL DEFAULT '0', "invoice_no" character varying NOT NULL, "transaction_id" character varying, "bank_id" integer, "bank_account" character varying, "bank_account_name" character varying, "method" "public"."driver_transaction_histories_method_enum" NOT NULL, "description" character varying NOT NULL DEFAULT '', "error_message" character varying, CONSTRAINT "PK_c5203e71eec508f0b1635fd040e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "driver_transaction_histories" ADD CONSTRAINT "FK_371de845b35b7060fa6c42f4560" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_transaction_histories" ADD CONSTRAINT "FK_0d7f3871a9c6e2ff307b0982c4f" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_transaction_histories" DROP CONSTRAINT "FK_0d7f3871a9c6e2ff307b0982c4f"`);
        await queryRunner.query(`ALTER TABLE "driver_transaction_histories" DROP CONSTRAINT "FK_371de845b35b7060fa6c42f4560"`);
        await queryRunner.query(`DROP TABLE "driver_transaction_histories"`);
        await queryRunner.query(`DROP TYPE "public"."driver_transaction_histories_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."driver_transaction_histories_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."driver_transaction_histories_status_enum"`);
    }

}
