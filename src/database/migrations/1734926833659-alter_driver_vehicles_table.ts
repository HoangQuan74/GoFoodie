import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDriverVehiclesTable1734926833659 implements MigrationInterface {
    name = 'AlterDriverVehiclesTable1734926833659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_vehicles" DROP COLUMN "license_plate_image_id"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" ADD "license_plate_image_id" uuid`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" DROP COLUMN "driver_license_front_image_id"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" ADD "driver_license_front_image_id" uuid`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" DROP COLUMN "driver_license_back_image_id"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" ADD "driver_license_back_image_id" uuid`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" DROP COLUMN "vehicle_registration_front_image_id"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" ADD "vehicle_registration_front_image_id" uuid`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" DROP COLUMN "vehicle_registration_back_image_id"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" ADD "vehicle_registration_back_image_id" uuid`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" ADD CONSTRAINT "FK_8f5fe4179a3a35a170e9a67a446" FOREIGN KEY ("license_plate_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" ADD CONSTRAINT "FK_fcda6016e4a74a2aa8001de07d9" FOREIGN KEY ("driver_license_front_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" ADD CONSTRAINT "FK_4397979cd9df37c2455abf22708" FOREIGN KEY ("driver_license_back_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" ADD CONSTRAINT "FK_e90177677a19af3d48ab8f532c5" FOREIGN KEY ("vehicle_registration_front_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" ADD CONSTRAINT "FK_53718d8aa7c5d9c177f94765459" FOREIGN KEY ("vehicle_registration_back_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_vehicles" DROP CONSTRAINT "FK_53718d8aa7c5d9c177f94765459"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" DROP CONSTRAINT "FK_e90177677a19af3d48ab8f532c5"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" DROP CONSTRAINT "FK_4397979cd9df37c2455abf22708"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" DROP CONSTRAINT "FK_fcda6016e4a74a2aa8001de07d9"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" DROP CONSTRAINT "FK_8f5fe4179a3a35a170e9a67a446"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" DROP COLUMN "vehicle_registration_back_image_id"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" ADD "vehicle_registration_back_image_id" character varying`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" DROP COLUMN "vehicle_registration_front_image_id"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" ADD "vehicle_registration_front_image_id" character varying`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" DROP COLUMN "driver_license_back_image_id"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" ADD "driver_license_back_image_id" character varying`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" DROP COLUMN "driver_license_front_image_id"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" ADD "driver_license_front_image_id" character varying`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" DROP COLUMN "license_plate_image_id"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" ADD "license_plate_image_id" character varying`);
    }

}
