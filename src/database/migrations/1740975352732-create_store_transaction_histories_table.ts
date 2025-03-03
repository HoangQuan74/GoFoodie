import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStoreTransactionHistoriesTable1740975352732 implements MigrationInterface {
    name = 'CreateStoreTransactionHistoriesTable1740975352732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."store_transaction_histories_status_enum" AS ENUM('pending', 'success', 'failed')`);
        await queryRunner.query(`CREATE TYPE "public"."store_transaction_histories_type_enum" AS ENUM('deposit', 'withdraw', 'transfer')`);
        await queryRunner.query(`CREATE TYPE "public"."store_transaction_histories_method_enum" AS ENUM('COLLECTION', 'ATM_CARD', 'CREDIT_CARD')`);
        await queryRunner.query(`CREATE TABLE "store_transaction_histories" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "store_id" integer NOT NULL, "amount" bigint NOT NULL, "balance" bigint NOT NULL, "status" "public"."store_transaction_histories_status_enum" NOT NULL DEFAULT 'pending', "type" "public"."store_transaction_histories_type_enum" NOT NULL, "invoice_no" character varying NOT NULL, "transaction_id" integer, "bank_id" integer, "bank_account" character varying, "bank_account_name" character varying, "method" "public"."store_transaction_histories_method_enum" NOT NULL, "description" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_4f4bfdd666031428abc6cb16219" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "balance" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "store_transaction_histories" ADD CONSTRAINT "FK_527e58a954a72fba89a66d0ed7e" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_transaction_histories" ADD CONSTRAINT "FK_a89c213ffa7870badaae79a81af" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_transaction_histories" DROP CONSTRAINT "FK_a89c213ffa7870badaae79a81af"`);
        await queryRunner.query(`ALTER TABLE "store_transaction_histories" DROP CONSTRAINT "FK_527e58a954a72fba89a66d0ed7e"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "balance"`);
        await queryRunner.query(`DROP TABLE "store_transaction_histories"`);
        await queryRunner.query(`DROP TYPE "public"."store_transaction_histories_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."store_transaction_histories_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."store_transaction_histories_status_enum"`);
    }

}
