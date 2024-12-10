import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDriversTable1733732778360 implements MigrationInterface {
    name = 'AlterDriversTable1733732778360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drivers" ADD CONSTRAINT "FK_86bbe63c1f2cb570ccbc951911e" FOREIGN KEY ("active_area_id") REFERENCES "provinces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "FK_86bbe63c1f2cb570ccbc951911e"`);
    }

}
