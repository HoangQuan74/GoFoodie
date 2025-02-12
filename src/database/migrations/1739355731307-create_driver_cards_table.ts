import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDriverCardsTable1739355731307 implements MigrationInterface {
    name = 'CreateDriverCardsTable1739355731307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "driver_cards" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "driver_id" integer NOT NULL, "card_number" character varying NOT NULL, "card_holder" character varying NOT NULL, "expiry_date" character varying NOT NULL, "cvv" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "country" character varying NOT NULL, "postal_code" character varying NOT NULL, "phone_number" character varying NOT NULL, CONSTRAINT "PK_f1ded96b4438b6e0117e8d8eae1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "driver_cards" ADD CONSTRAINT "FK_693103237d98065cebff3d0c225" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_cards" DROP CONSTRAINT "FK_693103237d98065cebff3d0c225"`);
        await queryRunner.query(`DROP TABLE "driver_cards"`);
    }

}
