import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStorePreparationTimesTable1739433452383 implements MigrationInterface {
    name = 'CreateStorePreparationTimesTable1739433452383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "store_preparation_times" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "store_id" integer NOT NULL, "day_of_week" integer NOT NULL, "start_time" integer NOT NULL, "end_time" integer NOT NULL, "preparation_time" integer NOT NULL, CONSTRAINT "PK_11fc76ee0ef1499647c79ad058e" PRIMARY KEY ("id")); COMMENT ON COLUMN "store_preparation_times"."preparation_time" IS 'minutes'`);
        await queryRunner.query(`ALTER TABLE "store_preparation_times" ADD CONSTRAINT "FK_c890290305d579fe1fe0541785a" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_preparation_times" DROP CONSTRAINT "FK_c890290305d579fe1fe0541785a"`);
        await queryRunner.query(`DROP TABLE "store_preparation_times"`);
    }

}
