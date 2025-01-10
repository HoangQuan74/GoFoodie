import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStoreAddressTable1736476314498 implements MigrationInterface {
    name = 'CreateStoreAddressTable1736476314498'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."store_address_type_enum" AS ENUM('receive', 'return')`);
        await queryRunner.query(`CREATE TABLE "store_address" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "store_id" integer NOT NULL, "address" character varying NOT NULL, "building" character varying, "gate" character varying, "lat" integer NOT NULL, "lng" integer NOT NULL, "type" "public"."store_address_type_enum" NOT NULL, CONSTRAINT "PK_f3eb3afc763da3076e80e2459dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "store_address" ADD CONSTRAINT "FK_0f6b50ae06eb4be5a83e2a2da0f" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_address" DROP CONSTRAINT "FK_0f6b50ae06eb4be5a83e2a2da0f"`);
        await queryRunner.query(`DROP TABLE "store_address"`);
        await queryRunner.query(`DROP TYPE "public"."store_address_type_enum"`);
    }

}
