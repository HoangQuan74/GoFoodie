import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoresTable1732801964014 implements MigrationInterface {
    name = 'AlterStoresTable1732801964014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_d7a69407c67c17a29403d6a739a"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_a3bf2205e60a2d5a2d2b22c0ad8"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_d7a1d3c5c68cb9245e9f94fcd01"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_b526af784966fdc750861af1739"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_9c590ae1483777903f8b953aa70"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_4e922f2bf81976574dea1d29725"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_afb7698f8ab0bd2875085092b45"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_8a15bea29d17239e1d9f55e7e73"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_069ced22c602187f1f4a0c4d6c0"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ALTER COLUMN "tax_code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ALTER COLUMN "tax_license_image_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_b239800ab44bfbd766deb2fd241"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_bfa280d0aee85cfbb9c319adbff"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_b792a8ca92c9abe6e273adc90bc"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_8af2c6f71b71ec5ebafe614c4bb"`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "province_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "district_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "ward_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "store_avatar_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "store_cover_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "store_front_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "store_menu_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_069ced22c602187f1f4a0c4d6c0" FOREIGN KEY ("tax_license_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_b239800ab44bfbd766deb2fd241" FOREIGN KEY ("store_avatar_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_bfa280d0aee85cfbb9c319adbff" FOREIGN KEY ("store_cover_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_b792a8ca92c9abe6e273adc90bc" FOREIGN KEY ("store_front_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_8af2c6f71b71ec5ebafe614c4bb" FOREIGN KEY ("store_menu_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_d7a69407c67c17a29403d6a739a" FOREIGN KEY ("approved_by_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_a3bf2205e60a2d5a2d2b22c0ad8" FOREIGN KEY ("created_by_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_8a15bea29d17239e1d9f55e7e73" FOREIGN KEY ("service_group_id") REFERENCES "service_groups"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_afb7698f8ab0bd2875085092b45" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_d7a1d3c5c68cb9245e9f94fcd01" FOREIGN KEY ("business_area") REFERENCES "provinces"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_b526af784966fdc750861af1739" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_9c590ae1483777903f8b953aa70" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_4e922f2bf81976574dea1d29725" FOREIGN KEY ("ward_id") REFERENCES "wards"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_4e922f2bf81976574dea1d29725"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_9c590ae1483777903f8b953aa70"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_b526af784966fdc750861af1739"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_d7a1d3c5c68cb9245e9f94fcd01"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_afb7698f8ab0bd2875085092b45"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_8a15bea29d17239e1d9f55e7e73"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_a3bf2205e60a2d5a2d2b22c0ad8"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_d7a69407c67c17a29403d6a739a"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_8af2c6f71b71ec5ebafe614c4bb"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_b792a8ca92c9abe6e273adc90bc"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_bfa280d0aee85cfbb9c319adbff"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_b239800ab44bfbd766deb2fd241"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_069ced22c602187f1f4a0c4d6c0"`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "store_menu_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "store_front_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "store_cover_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "store_avatar_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "ward_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "district_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "province_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_8af2c6f71b71ec5ebafe614c4bb" FOREIGN KEY ("store_menu_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_b792a8ca92c9abe6e273adc90bc" FOREIGN KEY ("store_front_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_bfa280d0aee85cfbb9c319adbff" FOREIGN KEY ("store_cover_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_b239800ab44bfbd766deb2fd241" FOREIGN KEY ("store_avatar_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ALTER COLUMN "tax_license_image_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ALTER COLUMN "tax_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_069ced22c602187f1f4a0c4d6c0" FOREIGN KEY ("tax_license_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_8a15bea29d17239e1d9f55e7e73" FOREIGN KEY ("service_group_id") REFERENCES "service_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_afb7698f8ab0bd2875085092b45" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_4e922f2bf81976574dea1d29725" FOREIGN KEY ("ward_id") REFERENCES "wards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_9c590ae1483777903f8b953aa70" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_b526af784966fdc750861af1739" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_d7a1d3c5c68cb9245e9f94fcd01" FOREIGN KEY ("business_area") REFERENCES "provinces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_a3bf2205e60a2d5a2d2b22c0ad8" FOREIGN KEY ("created_by_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_d7a69407c67c17a29403d6a739a" FOREIGN KEY ("approved_by_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
