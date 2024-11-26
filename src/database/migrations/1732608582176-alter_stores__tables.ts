import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStores_tables1732608582176 implements MigrationInterface {
    name = 'AlterStores_tables1732608582176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "service_group"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "service_type_id" integer`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_8a15bea29d17239e1d9f55e7e73"`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "service_group_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_8a15bea29d17239e1d9f55e7e73" FOREIGN KEY ("service_group_id") REFERENCES "service_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_afb7698f8ab0bd2875085092b45" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_d7a1d3c5c68cb9245e9f94fcd01" FOREIGN KEY ("business_area") REFERENCES "provinces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_b526af784966fdc750861af1739" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_9c590ae1483777903f8b953aa70" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_4e922f2bf81976574dea1d29725" FOREIGN KEY ("ward_id") REFERENCES "wards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_4e922f2bf81976574dea1d29725"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_9c590ae1483777903f8b953aa70"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_b526af784966fdc750861af1739"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_d7a1d3c5c68cb9245e9f94fcd01"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_afb7698f8ab0bd2875085092b45"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_8a15bea29d17239e1d9f55e7e73"`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "service_group_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_8a15bea29d17239e1d9f55e7e73" FOREIGN KEY ("service_group_id") REFERENCES "service_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "service_type_id"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "service_group" integer`);
    }

}
