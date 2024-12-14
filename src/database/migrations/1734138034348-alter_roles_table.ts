import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterRolesTable1734138034348 implements MigrationInterface {
    name = 'AlterRolesTable1734138034348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "description" SET NOT NULL`);
    }

}
