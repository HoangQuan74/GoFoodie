import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDriverUniformTable1734916352326 implements MigrationInterface {
    name = 'AlterDriverUniformTable1734916352326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD "contract_file_id" uuid`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD CONSTRAINT "FK_6a6e91f755353508cb5f191373b" FOREIGN KEY ("contract_file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP CONSTRAINT "FK_6a6e91f755353508cb5f191373b"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP COLUMN "contract_file_id"`);
    }

}
