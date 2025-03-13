import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStoreCardsTable1741866117591 implements MigrationInterface {
    name = 'CreateStoreCardsTable1741866117591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "store_cards" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "store_id" integer NOT NULL, "bank_code" character varying NOT NULL, "type" character varying NOT NULL, "card_number" character varying NOT NULL, "card_holder" character varying NOT NULL, "expiry_date" character varying NOT NULL, "cvv" character varying, "address" character varying, "city" character varying, "country" character varying, "postal_code" character varying, "phone_number" character varying, CONSTRAINT "PK_60b9728eb64f7a912c782cd27df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "driver_cards" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "driver_cards" ADD "bank_code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_cards" ADD CONSTRAINT "FK_0e60a862521179b4b2c158e8ce8" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_cards" DROP CONSTRAINT "FK_0e60a862521179b4b2c158e8ce8"`);
        await queryRunner.query(`ALTER TABLE "driver_cards" DROP COLUMN "bank_code"`);
        await queryRunner.query(`ALTER TABLE "driver_cards" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TABLE "store_cards"`);
    }

}
