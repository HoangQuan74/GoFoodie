import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClientCoinHistoriesTable1741099476843 implements MigrationInterface {
    name = 'CreateClientCoinHistoriesTable1741099476843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "client_coin_histories" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "client_id" integer NOT NULL, "amount" bigint NOT NULL, "balance" bigint NOT NULL, "type" character varying NOT NULL, "expired_at" TIMESTAMP, "description" character varying NOT NULL DEFAULT '', "related_id" integer, CONSTRAINT "PK_d27ab1169de281b7d6a9fa6fbd6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "client_coin_histories" ADD CONSTRAINT "FK_44e3c75179f3b436dcd365051dc" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_coin_histories" DROP CONSTRAINT "FK_44e3c75179f3b436dcd365051dc"`);
        await queryRunner.query(`DROP TABLE "client_coin_histories"`);
    }

}
