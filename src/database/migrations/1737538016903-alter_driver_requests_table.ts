import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDriverRequestsTable1737538016903 implements MigrationInterface {
    name = 'AlterDriverRequestsTable1737538016903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchant_requests" DROP CONSTRAINT "FK_ed0c2ed447fef31441c450da43f"`);
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP CONSTRAINT "FK_b29f4d1aed6cc94e9228ad133c4"`);
        await queryRunner.query(`CREATE TABLE "request_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_795c261c2ebf6beb3f417acd40b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP COLUMN "processed_by_id"`);
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP COLUMN "processed_at"`);
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP COLUMN "reject_reason"`);
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD "type_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD "approved_by_id" integer`);
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD "approved_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD "reason" character varying`);
        await queryRunner.query(`ALTER TABLE "merchant_requests" ADD CONSTRAINT "FK_ed0c2ed447fef31441c450da43f" FOREIGN KEY ("type_id") REFERENCES "request_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD CONSTRAINT "FK_6f17a4d796a64cb285927c23168" FOREIGN KEY ("approved_by_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD CONSTRAINT "FK_9999ddc8f1c4fe66747effa26dc" FOREIGN KEY ("type_id") REFERENCES "request_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "merchant_request_types"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "merchant_request_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e455b780baa2a6cd5afb9219a4d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP CONSTRAINT "FK_9999ddc8f1c4fe66747effa26dc"`);
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP CONSTRAINT "FK_6f17a4d796a64cb285927c23168"`);
        await queryRunner.query(`ALTER TABLE "merchant_requests" DROP CONSTRAINT "FK_ed0c2ed447fef31441c450da43f"`);
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP COLUMN "reason"`);
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP COLUMN "approved_at"`);
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP COLUMN "approved_by_id"`);
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP COLUMN "type_id"`);
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD "reject_reason" character varying`);
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD "processed_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD "processed_by_id" integer`);
        await queryRunner.query(`DROP TABLE "request_types"`);
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD CONSTRAINT "FK_b29f4d1aed6cc94e9228ad133c4" FOREIGN KEY ("processed_by_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "merchant_requests" ADD CONSTRAINT "FK_ed0c2ed447fef31441c450da43f" FOREIGN KEY ("type_id") REFERENCES "merchant_request_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
