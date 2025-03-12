import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreCoinHistoryTable1741790450752 implements MigrationInterface {
    name = 'AlterStoreCoinHistoryTable1741790450752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD "coin_balance" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "promotion_coin_balance" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "store_coin_histories" ADD "invoice_no" character varying`);
        await queryRunner.query(`ALTER TABLE "store_coin_histories" ADD "fee" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "store_coin_histories" ADD "total_paid" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE TYPE "public"."store_coin_histories_status_enum" AS ENUM('pending', 'success', 'failed')`);
        await queryRunner.query(`ALTER TABLE "store_coin_histories" ADD "status" "public"."store_coin_histories_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`CREATE TYPE "public"."store_coin_histories_method_enum" AS ENUM('COLLECTION', 'ATM_CARD', 'CREDIT_CARD', 'WALLET')`);
        await queryRunner.query(`ALTER TABLE "store_coin_histories" ADD "method" "public"."store_coin_histories_method_enum"`);
        await queryRunner.query(`ALTER TABLE "store_coin_histories" ADD "bank_id" integer`);
        await queryRunner.query(`ALTER TABLE "store_coin_histories" ADD "bank_account" character varying`);
        await queryRunner.query(`ALTER TABLE "store_coin_histories" ADD "bank_account_name" character varying`);
        await queryRunner.query(`ALTER TYPE "public"."store_transaction_histories_type_enum" RENAME TO "store_transaction_histories_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."store_transaction_histories_type_enum" AS ENUM('deposit', 'withdraw', 'transfer', 'recharge_coin')`);
        await queryRunner.query(`ALTER TABLE "store_transaction_histories" ALTER COLUMN "type" TYPE "public"."store_transaction_histories_type_enum" USING "type"::"text"::"public"."store_transaction_histories_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."store_transaction_histories_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."store_transaction_histories_method_enum" RENAME TO "store_transaction_histories_method_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."store_transaction_histories_method_enum" AS ENUM('COLLECTION', 'ATM_CARD', 'CREDIT_CARD', 'WALLET')`);
        await queryRunner.query(`ALTER TABLE "store_transaction_histories" ALTER COLUMN "method" TYPE "public"."store_transaction_histories_method_enum" USING "method"::"text"::"public"."store_transaction_histories_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."store_transaction_histories_method_enum_old"`);
        await queryRunner.query(`ALTER TABLE "store_coin_events" DROP CONSTRAINT "FK_d9d3b45d54546b6b0831ecd5602"`);
        await queryRunner.query(`DROP TABLE "store_coin_events"`);
        await queryRunner.query(`DROP TYPE "public"."store_coin_events_type_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."store_transaction_histories_method_enum_old" AS ENUM('COLLECTION', 'ATM_CARD', 'CREDIT_CARD')`);
        await queryRunner.query(`ALTER TABLE "store_transaction_histories" ALTER COLUMN "method" TYPE "public"."store_transaction_histories_method_enum_old" USING "method"::"text"::"public"."store_transaction_histories_method_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."store_transaction_histories_method_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."store_transaction_histories_method_enum_old" RENAME TO "store_transaction_histories_method_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."store_transaction_histories_type_enum_old" AS ENUM('deposit', 'withdraw', 'transfer')`);
        await queryRunner.query(`ALTER TABLE "store_transaction_histories" ALTER COLUMN "type" TYPE "public"."store_transaction_histories_type_enum_old" USING "type"::"text"::"public"."store_transaction_histories_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."store_transaction_histories_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."store_transaction_histories_type_enum_old" RENAME TO "store_transaction_histories_type_enum"`);
        await queryRunner.query(`ALTER TABLE "store_coin_histories" DROP COLUMN "bank_account_name"`);
        await queryRunner.query(`ALTER TABLE "store_coin_histories" DROP COLUMN "bank_account"`);
        await queryRunner.query(`ALTER TABLE "store_coin_histories" DROP COLUMN "bank_id"`);
        await queryRunner.query(`ALTER TABLE "store_coin_histories" DROP COLUMN "method"`);
        await queryRunner.query(`DROP TYPE "public"."store_coin_histories_method_enum"`);
        await queryRunner.query(`ALTER TABLE "store_coin_histories" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."store_coin_histories_status_enum"`);
        await queryRunner.query(`ALTER TABLE "store_coin_histories" DROP COLUMN "total_paid"`);
        await queryRunner.query(`ALTER TABLE "store_coin_histories" DROP COLUMN "fee"`);
        await queryRunner.query(`ALTER TABLE "store_coin_histories" DROP COLUMN "invoice_no"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "promotion_coin_balance"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "coin_balance"`);
        await queryRunner.query(`CREATE TYPE "public"."store_coin_events_type_enum" AS ENUM('client_review')`);
        await queryRunner.query(`CREATE TABLE "store_coin_events" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "store_id" integer NOT NULL, "name" integer NOT NULL, "type" "public"."store_coin_events_type_enum" NOT NULL, "promotion_coin" integer NOT NULL DEFAULT '0', "start_date" TIMESTAMP, "end_date" TIMESTAMP, CONSTRAINT "PK_825ba21508f399b0f515b03131a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "store_coin_events" ADD CONSTRAINT "FK_d9d3b45d54546b6b0831ecd5602" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
