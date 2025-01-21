import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMerchantRequestsTable1737452146961 implements MigrationInterface {
    name = 'CreateMerchantRequestsTable1737452146961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "merchant_request_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e455b780baa2a6cd5afb9219a4d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."merchant_requests_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "merchant_requests" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "merchant_id" integer NOT NULL, "store_id" integer NOT NULL, "type_id" integer NOT NULL, "description" character varying NOT NULL, "status" "public"."merchant_requests_status_enum" NOT NULL DEFAULT 'pending', "approved_by_id" integer, CONSTRAINT "PK_de7db5ea0a2334234ca43646d76" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "merchant_requests" ADD CONSTRAINT "FK_5f0cfc01731d4d9e78f1db59a80" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "merchant_requests" ADD CONSTRAINT "FK_ed0c2ed447fef31441c450da43f" FOREIGN KEY ("type_id") REFERENCES "merchant_request_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "merchant_requests" ADD CONSTRAINT "FK_1f0192d8797e05d715e60530e42" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "merchant_requests" ADD CONSTRAINT "FK_62c90bc69c9874428cf92954da8" FOREIGN KEY ("approved_by_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchant_requests" DROP CONSTRAINT "FK_62c90bc69c9874428cf92954da8"`);
        await queryRunner.query(`ALTER TABLE "merchant_requests" DROP CONSTRAINT "FK_1f0192d8797e05d715e60530e42"`);
        await queryRunner.query(`ALTER TABLE "merchant_requests" DROP CONSTRAINT "FK_ed0c2ed447fef31441c450da43f"`);
        await queryRunner.query(`ALTER TABLE "merchant_requests" DROP CONSTRAINT "FK_5f0cfc01731d4d9e78f1db59a80"`);
        await queryRunner.query(`DROP TABLE "merchant_requests"`);
        await queryRunner.query(`DROP TYPE "public"."merchant_requests_status_enum"`);
        await queryRunner.query(`DROP TABLE "merchant_request_types"`);
    }

}
