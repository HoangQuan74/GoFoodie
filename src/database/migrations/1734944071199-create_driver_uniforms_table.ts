import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDriverUniformsTable1734944071199 implements MigrationInterface {
    name = 'CreateDriverUniformsTable1734944071199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP CONSTRAINT "FK_6a6e91f755353508cb5f191373b"`);
        await queryRunner.query(`ALTER TABLE "driver_uniform_sizes" DROP CONSTRAINT "FK_9c3fd0b68e90a1c0d066016ebce"`);
        await queryRunner.query(`CREATE TABLE "uniforms" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, "delivery_fee" integer NOT NULL DEFAULT '0', "price" integer NOT NULL, "contract_file_id" uuid, CONSTRAINT "PK_62537e9758f35c5c5914c20a5af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "uniform_images" ("uniform_id" integer NOT NULL, "file_id" uuid NOT NULL, CONSTRAINT "PK_4c86678604e2472f822ce8b2a51" PRIMARY KEY ("uniform_id", "file_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bb0c0153dd2ea772f4cefd211b" ON "uniform_images" ("uniform_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8608c69fd44ce481a08e470885" ON "uniform_images" ("file_id") `);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP COLUMN "contract_file_id"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD "driver_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD "quantity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD "ship_fee" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD "uniform_fee" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD "address" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."driver_uniforms_status_enum" AS ENUM('ordered')`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD "status" "public"."driver_uniforms_status_enum" NOT NULL DEFAULT 'ordered'`);
        await queryRunner.query(`CREATE TYPE "public"."driver_uniforms_payment_method_enum" AS ENUM('cash')`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD "payment_method" "public"."driver_uniforms_payment_method_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "uniforms" ADD CONSTRAINT "FK_91583402e5675c6e834484346f1" FOREIGN KEY ("contract_file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD CONSTRAINT "FK_bba0338c3e3a77ecb7f41d54793" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "uniform_images" ADD CONSTRAINT "FK_bb0c0153dd2ea772f4cefd211ba" FOREIGN KEY ("uniform_id") REFERENCES "uniforms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "uniform_images" ADD CONSTRAINT "FK_8608c69fd44ce481a08e470885f" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "driver_uniform_sizes" ADD CONSTRAINT "FK_9c3fd0b68e90a1c0d066016ebce" FOREIGN KEY ("driver_uniform_id") REFERENCES "uniforms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_uniform_sizes" DROP CONSTRAINT "FK_9c3fd0b68e90a1c0d066016ebce"`);
        await queryRunner.query(`ALTER TABLE "uniform_images" DROP CONSTRAINT "FK_8608c69fd44ce481a08e470885f"`);
        await queryRunner.query(`ALTER TABLE "uniform_images" DROP CONSTRAINT "FK_bb0c0153dd2ea772f4cefd211ba"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP CONSTRAINT "FK_bba0338c3e3a77ecb7f41d54793"`);
        await queryRunner.query(`ALTER TABLE "uniforms" DROP CONSTRAINT "FK_91583402e5675c6e834484346f1"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP COLUMN "payment_method"`);
        await queryRunner.query(`DROP TYPE "public"."driver_uniforms_payment_method_enum"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."driver_uniforms_status_enum"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP COLUMN "uniform_fee"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP COLUMN "ship_fee"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP COLUMN "driver_id"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD "contract_file_id" uuid`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD "price" integer NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8608c69fd44ce481a08e470885"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bb0c0153dd2ea772f4cefd211b"`);
        await queryRunner.query(`DROP TABLE "uniform_images"`);
        await queryRunner.query(`DROP TABLE "uniforms"`);
        await queryRunner.query(`ALTER TABLE "driver_uniform_sizes" ADD CONSTRAINT "FK_9c3fd0b68e90a1c0d066016ebce" FOREIGN KEY ("driver_uniform_id") REFERENCES "driver_uniforms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD CONSTRAINT "FK_6a6e91f755353508cb5f191373b" FOREIGN KEY ("contract_file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
