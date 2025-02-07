import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterRolesTable1738918969017 implements MigrationInterface {
    name = 'AlterRolesTable1738918969017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "distances" ("id" SERIAL NOT NULL, "origin_lat" double precision NOT NULL, "origin_long" double precision NOT NULL, "destination_lat" double precision NOT NULL, "destination_long" double precision NOT NULL, "distance_value" integer NOT NULL, "duration_value" integer NOT NULL, CONSTRAINT "PK_1bc713b1f9ebf7d1790039c11ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin_notifications" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "path" character varying, "is_read" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_1fecd1cab747b7ab6e850091901" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles_provinces" ("role_id" integer NOT NULL, "province_id" integer NOT NULL, CONSTRAINT "PK_1fc19fb1e0f8c870ed1f9a7e6d1" PRIMARY KEY ("role_id", "province_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7e8ca168480616916f58547101" ON "roles_provinces" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a1ef5a7d896a572968d9e025cf" ON "roles_provinces" ("province_id") `);
        await queryRunner.query(`CREATE TABLE "roles_service_types" ("role_id" integer NOT NULL, "service_type_id" integer NOT NULL, CONSTRAINT "PK_a3de334b72ee10ce0280f60bfdc" PRIMARY KEY ("role_id", "service_type_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f92ca6be967cb804f9d96071e7" ON "roles_service_types" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_9e54728f7b50d8da8b24c556d1" ON "roles_service_types" ("service_type_id") `);
        await queryRunner.query(`ALTER TABLE "store_working_times" ADD "is_open" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "roles_provinces" ADD CONSTRAINT "FK_7e8ca168480616916f58547101b" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_provinces" ADD CONSTRAINT "FK_a1ef5a7d896a572968d9e025cf7" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_service_types" ADD CONSTRAINT "FK_f92ca6be967cb804f9d96071e70" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_service_types" ADD CONSTRAINT "FK_9e54728f7b50d8da8b24c556d13" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles_service_types" DROP CONSTRAINT "FK_9e54728f7b50d8da8b24c556d13"`);
        await queryRunner.query(`ALTER TABLE "roles_service_types" DROP CONSTRAINT "FK_f92ca6be967cb804f9d96071e70"`);
        await queryRunner.query(`ALTER TABLE "roles_provinces" DROP CONSTRAINT "FK_a1ef5a7d896a572968d9e025cf7"`);
        await queryRunner.query(`ALTER TABLE "roles_provinces" DROP CONSTRAINT "FK_7e8ca168480616916f58547101b"`);
        await queryRunner.query(`ALTER TABLE "store_working_times" DROP COLUMN "is_open"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9e54728f7b50d8da8b24c556d1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f92ca6be967cb804f9d96071e7"`);
        await queryRunner.query(`DROP TABLE "roles_service_types"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a1ef5a7d896a572968d9e025cf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7e8ca168480616916f58547101"`);
        await queryRunner.query(`DROP TABLE "roles_provinces"`);
        await queryRunner.query(`DROP TABLE "admin_notifications"`);
        await queryRunner.query(`DROP TABLE "distances"`);
    }

}
