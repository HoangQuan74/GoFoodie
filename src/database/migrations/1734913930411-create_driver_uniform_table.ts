import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDriverUniformTable1734913930411 implements MigrationInterface {
    name = 'CreateDriverUniformTable1734913930411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "uniform_sizes" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_58fc34c324dce64e0880748fa05" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "driver_uniforms" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, "price" integer NOT NULL, CONSTRAINT "PK_d4afde4f80ff5ffb5f03418eb18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "driver_uniform_images" ("driver_uniform_id" integer NOT NULL, "file_id" uuid NOT NULL, CONSTRAINT "PK_9ffecbe2dcdae31226f7e7074f3" PRIMARY KEY ("driver_uniform_id", "file_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2565660306b002fe83dc9cd6fe" ON "driver_uniform_images" ("driver_uniform_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_61a4d45622bb2950b448eeb2bb" ON "driver_uniform_images" ("file_id") `);
        await queryRunner.query(`CREATE TABLE "driver_uniform_sizes" ("driver_uniform_id" integer NOT NULL, "driver_uniform_size_id" integer NOT NULL, CONSTRAINT "PK_5e78b54e4ebe4277c11fd5aa2d6" PRIMARY KEY ("driver_uniform_id", "driver_uniform_size_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9c3fd0b68e90a1c0d066016ebc" ON "driver_uniform_sizes" ("driver_uniform_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_57c98c731c9307dac479ccd885" ON "driver_uniform_sizes" ("driver_uniform_size_id") `);
        await queryRunner.query(`ALTER TABLE "driver_uniform_images" ADD CONSTRAINT "FK_2565660306b002fe83dc9cd6fec" FOREIGN KEY ("driver_uniform_id") REFERENCES "driver_uniforms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "driver_uniform_images" ADD CONSTRAINT "FK_61a4d45622bb2950b448eeb2bbb" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "driver_uniform_sizes" ADD CONSTRAINT "FK_9c3fd0b68e90a1c0d066016ebce" FOREIGN KEY ("driver_uniform_id") REFERENCES "driver_uniforms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "driver_uniform_sizes" ADD CONSTRAINT "FK_57c98c731c9307dac479ccd8859" FOREIGN KEY ("driver_uniform_size_id") REFERENCES "uniform_sizes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_uniform_sizes" DROP CONSTRAINT "FK_57c98c731c9307dac479ccd8859"`);
        await queryRunner.query(`ALTER TABLE "driver_uniform_sizes" DROP CONSTRAINT "FK_9c3fd0b68e90a1c0d066016ebce"`);
        await queryRunner.query(`ALTER TABLE "driver_uniform_images" DROP CONSTRAINT "FK_61a4d45622bb2950b448eeb2bbb"`);
        await queryRunner.query(`ALTER TABLE "driver_uniform_images" DROP CONSTRAINT "FK_2565660306b002fe83dc9cd6fec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_57c98c731c9307dac479ccd885"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9c3fd0b68e90a1c0d066016ebc"`);
        await queryRunner.query(`DROP TABLE "driver_uniform_sizes"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_61a4d45622bb2950b448eeb2bb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2565660306b002fe83dc9cd6fe"`);
        await queryRunner.query(`DROP TABLE "driver_uniform_images"`);
        await queryRunner.query(`DROP TABLE "driver_uniforms"`);
        await queryRunner.query(`DROP TABLE "uniform_sizes"`);
    }

}
