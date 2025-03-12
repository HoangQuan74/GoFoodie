import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStoreCoinHistoryTable1741685860915 implements MigrationInterface {
    name = 'CreateStoreCoinHistoryTable1741685860915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."store_coin_events_type_enum" AS ENUM('client_review')`);
        await queryRunner.query(`CREATE TABLE "store_coin_events" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "store_id" integer NOT NULL, "name" integer NOT NULL, "type" "public"."store_coin_events_type_enum" NOT NULL, "promotion_coin" integer NOT NULL DEFAULT '0', "start_date" TIMESTAMP, "end_date" TIMESTAMP, CONSTRAINT "PK_825ba21508f399b0f515b03131a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."store_coin_histories_type_enum" AS ENUM('shop_topup', 'goo_reward', 'shop_event_reward', 'review_reward')`);
        await queryRunner.query(`CREATE TABLE "store_coin_histories" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "store_id" integer NOT NULL, "amount" bigint NOT NULL DEFAULT '0', "balance" bigint NOT NULL DEFAULT '0', "type" "public"."store_coin_histories_type_enum" NOT NULL, "description" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_215c927435cca931d447e82bbee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "store_coin_events" ADD CONSTRAINT "FK_d9d3b45d54546b6b0831ecd5602" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_coin_histories" ADD CONSTRAINT "FK_7602fa4c65d61235feca8973c15" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_coin_histories" DROP CONSTRAINT "FK_7602fa4c65d61235feca8973c15"`);
        await queryRunner.query(`ALTER TABLE "store_coin_events" DROP CONSTRAINT "FK_d9d3b45d54546b6b0831ecd5602"`);
        await queryRunner.query(`DROP TABLE "store_coin_histories"`);
        await queryRunner.query(`DROP TYPE "public"."store_coin_histories_type_enum"`);
        await queryRunner.query(`DROP TABLE "store_coin_events"`);
        await queryRunner.query(`DROP TYPE "public"."store_coin_events_type_enum"`);
    }

}
