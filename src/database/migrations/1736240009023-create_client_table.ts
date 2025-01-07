import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClientTable1736240009023 implements MigrationInterface {
    name = 'CreateClientTable1736240009023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clients" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying, "email" character varying, "phone" character varying NOT NULL, "latitude" integer, "longitude" integer, "address" character varying, "device_token" character varying, "last_login" TIMESTAMP, CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "clients"`);
    }

}
