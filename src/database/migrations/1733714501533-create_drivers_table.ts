import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDriversTable1733714501533 implements MigrationInterface {
    name = 'CreateDriversTable1733714501533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "relationships" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_ba20e2f5cf487408e08e4dcecaf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "driver_banks" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "driver_id" integer NOT NULL, "bank_id" integer, "bank_branch_id" integer, "bank_account_number" character varying, "bank_account_name" character varying, CONSTRAINT "PK_85f58e63313179433adf9c1cb90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "driver_emergency_contacts" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "driver_id" integer NOT NULL, "name" character varying, "phone_number" character varying, "relationship_id" integer, CONSTRAINT "PK_15d9146ebd646dc21d42d97c540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "driver_vehicles" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "driver_id" integer NOT NULL, "license_plate_image_id" character varying, "driver_license_front_image_id" character varying, "driver_license_back_image_id" character varying, "vehicle_registration_front_image_id" character varying, "vehicle_registration_back_image_id" character varying, CONSTRAINT "REL_8c59dbd265e6e4bef030529402" UNIQUE ("driver_id"), CONSTRAINT "PK_62fdc4291e0b744653f218b47b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "drivers" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "full_name" character varying, "phone_number" character varying NOT NULL, "email" character varying, "email_verified_at" TIMESTAMP, "avatar" character varying, "active_area_id" integer, "temporary_address" character varying, "identity_card_front_id" character varying, "identity_card_back_id" character varying, "status" character varying NOT NULL DEFAULT 'active', "approvalStatus" character varying NOT NULL DEFAULT 'draft', CONSTRAINT "PK_92ab3fb69e566d3eb0cae896047" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "driver_vehicle_images" ("driver_vehicle_id" integer NOT NULL, "file_id" uuid NOT NULL, CONSTRAINT "PK_3ae1985ca9affa4965eb048cf38" PRIMARY KEY ("driver_vehicle_id", "file_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_064352f2123b1cf9b1098c9833" ON "driver_vehicle_images" ("driver_vehicle_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_05a8dfe700ceec3f91f163de62" ON "driver_vehicle_images" ("file_id") `);
        await queryRunner.query(`CREATE TABLE "driver_service_types" ("driver_id" integer NOT NULL, "service_type_id" integer NOT NULL, CONSTRAINT "PK_0986166d1c2ffd10a44bb1a60ca" PRIMARY KEY ("driver_id", "service_type_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d7400715cb38f4a39db88352b0" ON "driver_service_types" ("driver_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a5cfb43bd2e280e2c97b3b860b" ON "driver_service_types" ("service_type_id") `);
        await queryRunner.query(`ALTER TABLE "driver_banks" ADD CONSTRAINT "FK_6916f30db2e0fd3a9b70631771e" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_emergency_contacts" ADD CONSTRAINT "FK_8914d9c429df2bf9752baf0810f" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_emergency_contacts" ADD CONSTRAINT "FK_a0303d21faa8e7675a016f6c316" FOREIGN KEY ("relationship_id") REFERENCES "relationships"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" ADD CONSTRAINT "FK_8c59dbd265e6e4bef0305294022" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_vehicle_images" ADD CONSTRAINT "FK_064352f2123b1cf9b1098c9833d" FOREIGN KEY ("driver_vehicle_id") REFERENCES "driver_vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "driver_vehicle_images" ADD CONSTRAINT "FK_05a8dfe700ceec3f91f163de620" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "driver_service_types" ADD CONSTRAINT "FK_d7400715cb38f4a39db88352b09" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "driver_service_types" ADD CONSTRAINT "FK_a5cfb43bd2e280e2c97b3b860bc" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_service_types" DROP CONSTRAINT "FK_a5cfb43bd2e280e2c97b3b860bc"`);
        await queryRunner.query(`ALTER TABLE "driver_service_types" DROP CONSTRAINT "FK_d7400715cb38f4a39db88352b09"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicle_images" DROP CONSTRAINT "FK_05a8dfe700ceec3f91f163de620"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicle_images" DROP CONSTRAINT "FK_064352f2123b1cf9b1098c9833d"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" DROP CONSTRAINT "FK_8c59dbd265e6e4bef0305294022"`);
        await queryRunner.query(`ALTER TABLE "driver_emergency_contacts" DROP CONSTRAINT "FK_a0303d21faa8e7675a016f6c316"`);
        await queryRunner.query(`ALTER TABLE "driver_emergency_contacts" DROP CONSTRAINT "FK_8914d9c429df2bf9752baf0810f"`);
        await queryRunner.query(`ALTER TABLE "driver_banks" DROP CONSTRAINT "FK_6916f30db2e0fd3a9b70631771e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a5cfb43bd2e280e2c97b3b860b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d7400715cb38f4a39db88352b0"`);
        await queryRunner.query(`DROP TABLE "driver_service_types"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_05a8dfe700ceec3f91f163de62"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_064352f2123b1cf9b1098c9833"`);
        await queryRunner.query(`DROP TABLE "driver_vehicle_images"`);
        await queryRunner.query(`DROP TABLE "drivers"`);
        await queryRunner.query(`DROP TABLE "driver_vehicles"`);
        await queryRunner.query(`DROP TABLE "driver_emergency_contacts"`);
        await queryRunner.query(`DROP TABLE "driver_banks"`);
        await queryRunner.query(`DROP TABLE "relationships"`);
    }

}
