import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFlashSaleTimeFramesTable1736759838900 implements MigrationInterface {
    name = 'CreateFlashSaleTimeFramesTable1736759838900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "flash_sale_time_frames" ("id" SERIAL NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, CONSTRAINT "PK_c0374a77e7a37f4afe761f63719" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "flash_sales" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "time_frame_id" integer NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "timeFrameId" integer, CONSTRAINT "PK_70299593044ffcba05cc30b97dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "client_addresses" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."client_addresses_type_enum"`);
        await queryRunner.query(`ALTER TABLE "client_addresses" ADD "type" character varying`);
        await queryRunner.query(`ALTER TABLE "flash_sales" ADD CONSTRAINT "FK_509f77d8450623f2ab437d003dc" FOREIGN KEY ("timeFrameId") REFERENCES "flash_sale_time_frames"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flash_sales" DROP CONSTRAINT "FK_509f77d8450623f2ab437d003dc"`);
        await queryRunner.query(`ALTER TABLE "client_addresses" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."client_addresses_type_enum" AS ENUM('home', 'work', 'other')`);
        await queryRunner.query(`ALTER TABLE "client_addresses" ADD "type" "public"."client_addresses_type_enum" NOT NULL DEFAULT 'home'`);
        await queryRunner.query(`DROP TABLE "flash_sales"`);
        await queryRunner.query(`DROP TABLE "flash_sale_time_frames"`);
    }

}
