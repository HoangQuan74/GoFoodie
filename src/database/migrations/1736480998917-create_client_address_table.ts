import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClientAddressTable1736480998917 implements MigrationInterface {
    name = 'CreateClientAddressTable1736480998917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."client_addresses_type_enum" AS ENUM('home', 'work', 'other')`);
        await queryRunner.query(`CREATE TABLE "client_addresses" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "client_id" integer NOT NULL, "name" character varying NOT NULL, "phone" character varying NOT NULL, "address" character varying NOT NULL, "latitude" integer NOT NULL, "longitude" integer NOT NULL, "building" character varying, "gate" character varying, "type" "public"."client_addresses_type_enum" NOT NULL DEFAULT 'home', "is_default" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_1df84115ce2e00312a3cca277e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "client_addresses" ADD CONSTRAINT "FK_a88557f9d4f0eebd10e1c46af73" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_addresses" DROP CONSTRAINT "FK_a88557f9d4f0eebd10e1c46af73"`);
        await queryRunner.query(`DROP TABLE "client_addresses"`);
        await queryRunner.query(`DROP TYPE "public"."client_addresses_type_enum"`);
    }

}
