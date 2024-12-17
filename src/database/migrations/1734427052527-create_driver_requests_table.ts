import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDriverRequestsTable1734427052527 implements MigrationInterface {
    name = 'CreateDriverRequestsTable1734427052527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."driver_requests_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "driver_requests" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "type" character varying NOT NULL, "status" "public"."driver_requests_status_enum" NOT NULL DEFAULT 'pending', "driver_id" integer NOT NULL, "processed_by_id" integer, CONSTRAINT "PK_c4dfd59a049955c4c5e34e31aaf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "driver_request_files" ("driver_request_id" integer NOT NULL, "file_id" uuid NOT NULL, CONSTRAINT "PK_e22aab225402f312ebafc9a04dc" PRIMARY KEY ("driver_request_id", "file_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_98640da8eaae2207cbbcb692a2" ON "driver_request_files" ("driver_request_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c73fe60c253a62d6e03b56dcb5" ON "driver_request_files" ("file_id") `);
        await queryRunner.query(`ALTER TABLE "product_approvals" ADD "code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD CONSTRAINT "FK_bac1db61b1363209e954bbdf55b" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_requests" ADD CONSTRAINT "FK_b29f4d1aed6cc94e9228ad133c4" FOREIGN KEY ("processed_by_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_request_files" ADD CONSTRAINT "FK_98640da8eaae2207cbbcb692a22" FOREIGN KEY ("driver_request_id") REFERENCES "driver_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "driver_request_files" ADD CONSTRAINT "FK_c73fe60c253a62d6e03b56dcb51" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_request_files" DROP CONSTRAINT "FK_c73fe60c253a62d6e03b56dcb51"`);
        await queryRunner.query(`ALTER TABLE "driver_request_files" DROP CONSTRAINT "FK_98640da8eaae2207cbbcb692a22"`);
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP CONSTRAINT "FK_b29f4d1aed6cc94e9228ad133c4"`);
        await queryRunner.query(`ALTER TABLE "driver_requests" DROP CONSTRAINT "FK_bac1db61b1363209e954bbdf55b"`);
        await queryRunner.query(`ALTER TABLE "product_approvals" DROP COLUMN "code"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c73fe60c253a62d6e03b56dcb5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_98640da8eaae2207cbbcb692a2"`);
        await queryRunner.query(`DROP TABLE "driver_request_files"`);
        await queryRunner.query(`DROP TABLE "driver_requests"`);
        await queryRunner.query(`DROP TYPE "public"."driver_requests_status_enum"`);
    }

}
