import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDriverUniformsTable1734946104679 implements MigrationInterface {
    name = 'AlterDriverUniformsTable1734946104679'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD "size_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD CONSTRAINT "FK_3ef1bf66237c08705f279c9daa7" FOREIGN KEY ("size_id") REFERENCES "uniform_sizes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP CONSTRAINT "FK_3ef1bf66237c08705f279c9daa7"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP COLUMN "size_id"`);
    }

}
